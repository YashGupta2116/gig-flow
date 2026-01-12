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
      .findById({ freelancerId: freelancerId })
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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bid = await bids.findById(bidId).populate("gigId").session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = bid.gigId;

    if (gig.ownerId.toString() !== ownerId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ error: "Not Authorized" });
    }

    if (gig.status !== "OPEN") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Gig is already assigned" });
    }

    await gigs.findByIdAndUpdate(gig._id, { status: "ASSIGNED" }, { session });

    await bids.findByIdAndUpdate(bid._id, { status: "HIRED" }, { session });

    await bids.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: "PENDING",
      },
      { status: "REJECTED" },
      { session }
    );

    await session.commitTransaction();

    const updatedBid = await bids
      .findById(bid._id)
      .populate("freelancerId", "name email")
      .populate("gigId", "title budget");

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

    res.json({
      message: "Freelancer hired successfully",
      bid: updatedBid,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
}
