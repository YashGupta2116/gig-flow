import { bids } from "../models/Bid.js";
import { gigs } from "../models/Gigs.js";
import mongoose from "mongoose";

export async function createBid(req, res) {
  const biderId = req.user._id;

  if (!biderId) return res.status(401).json({ error: "Unauthorized access" });

  const { gigId, message, price } = req.body;

  try {
    const gig = await gigs.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.status !== "OPEN") {
      return res.status(400).json({ message: "Gig is no longer open" });
    }

    if (gig.ownerId.toString() === biderId.toString()) {
      return res.status(400).json({ message: "Cannot bid on your own gig" });
    }

    const bid = await bids.create({
      gigId,
      freelancerId: biderId,
      message,
      price,
    });

    const populatedBid = await bids
      .findById(bid._id)
      .populate("freelancerId", "name email")
      .populate("gigId", "title");

    res.status(201).json(populatedBid);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already bid on this gig" });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function getBidsForGig(req, res) {
  const ownerId = req.user._id;
  const { gigId } = req.params;

  try {
    const gig = await gigs.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== ownerId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these bids" });
    }

    const bidsOnGig = await bids
      .find({ gigId: gigId })
      .populate("freelancerId", "name email")
      .sort("-createdAt");

    res.json(bidsOnGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserBids(req, res) {
  const freelancerId = req.user._id;

  try {
    const userBids = await bids
      .find({ freelancerId: freelancerId })
      .populate("gigId", "title budget status")
      .sort("-createdAt");

    res.json(userBids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function hireBidder(req, res) {
  const { bidId } = req.params;
  const ownerId = req.user._id;

  const sendNotification = async (bid, gig, updatedBid) => {
    const io = req.app.get("io");
    if (io) {
      io.to(bid.freelancerId.toString()).emit("hired", {
        message: `You have been hired for "${gig.title}"!`,
        gig: {
          id: gig._id,
          title: gig.title,
          budget: gig.budget,
        },
        bid: updatedBid,
      });
    }
  };

  const session = await mongoose.startSession();
  let transactionBid = null;
  let transactionGig = null;

  try {
    await session.withTransaction(async () => {
      transactionBid = await bids
        .findById(bidId)
        .populate("gigId")
        .session(session);

      if (!transactionBid) {
        throw new Error("Bid not found");
      }

      if (!transactionBid.gigId) {
        throw new Error("Gig not found for this bid");
      }

      transactionGig = transactionBid.gigId;

      if (transactionGig.ownerId.toString() !== ownerId.toString()) {
        throw new Error("Not Authorized");
      }

      const updatedGig = await gigs.findOneAndUpdate(
        { _id: transactionGig._id, status: "OPEN" },
        { status: "ASSIGNED" },
        { session, new: true }
      );

      if (!updatedGig) {
        throw new Error(
          "Gig is already assigned. Another user may have hired a freelancer simultaneously."
        );
      }

      await bids.findByIdAndUpdate(
        transactionBid._id,
        { status: "HIRED" },
        { session }
      );

      await bids.updateMany(
        {
          gigId: transactionGig._id,
          _id: { $ne: transactionBid._id },
          status: "PENDING",
        },
        { status: "REJECTED" },
        { session }
      );
    });

    const updatedBid = await bids
      .findById(bidId)
      .populate("freelancerId", "name email")
      .populate("gigId", "title budget");

    await sendNotification(transactionBid, transactionGig, updatedBid);

    res.json({
      message: "Freelancer hired successfully",
      bid: updatedBid,
    });
  } catch (error) {
    const isTransactionError =
      error.message &&
      (error.message.includes("replica set") ||
        error.message.includes("Transaction numbers are only allowed"));

    if (isTransactionError) {
      await session.endSession();

      try {
        const bid = await bids.findById(bidId).populate("gigId");

        if (!bid) {
          return res.status(404).json({ message: "Bid not found" });
        }

        if (!bid.gigId) {
          return res
            .status(404)
            .json({ message: "Gig not found for this bid" });
        }

        const gig = bid.gigId;

        if (gig.ownerId.toString() !== ownerId.toString()) {
          return res.status(403).json({ message: "Not Authorized" });
        }

        const updatedGig = await gigs.findOneAndUpdate(
          { _id: gig._id, status: "OPEN" },
          { status: "ASSIGNED" },
          { new: true }
        );

        if (!updatedGig) {
          return res.status(400).json({
            message:
              "Gig is already assigned. Another user may have hired a freelancer simultaneously.",
          });
        }

        await bids.findByIdAndUpdate(bid._id, { status: "HIRED" });

        await bids.updateMany(
          {
            gigId: gig._id,
            _id: { $ne: bid._id },
            status: "PENDING",
          },
          { status: "REJECTED" }
        );

        const updatedBid = await bids
          .findById(bid._id)
          .populate("freelancerId", "name email")
          .populate("gigId", "title budget");

        await sendNotification(bid, gig, updatedBid);

        res.json({
          message: "Freelancer hired successfully",
          bid: updatedBid,
        });
      } catch (fallbackError) {
        res.status(500).json({ message: fallbackError.message });
      }
    } else {
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("Authorized")
        ? 403
        : error.message.includes("already assigned")
        ? 400
        : 500;
      res.status(statusCode).json({ message: error.message });
    }
  } finally {
    try {
      await session.endSession();
    } catch (e) {}
  }
}
