import { gigs } from "../models/Gigs.js";

export async function getGigs(req, res) {
  const { search } = req.query;
  try {
    let query = { status: "OPEN" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];

      const foundGigs = await gigs
        .find(query)
        .populate("ownerId", "name email")
        .sort("-createdAt");

      res.json(foundGigs);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getGigById(req, res) {
  const { id } = req.params;

  try {
    const gig = await gigs.findById(id).populate("ownerId", "name email");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createGig(req, res) {
  const ownerId = req.user._id;
  const { title, description, budget } = req.body;

  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  try {
    const createdGig = await gigs.create({
      title,
      description,
      budget,
      ownerId,
    });

    const populatedGig = await gigs
      .findById(createGig._id)
      .populate("ownerId", "name email");

    res.status(201).json(populatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMyGigs(req, res) {
  const ownerId = req.user._id;
  if (!ownerId) return res.status(401).json({ error: "Unauthorized acces" });

  try {
    const userGigs = await gigs.find({ ownerId: ownerId }).sort("-createdAt");
    res.json(userGigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
