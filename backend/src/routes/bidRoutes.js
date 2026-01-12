import { Router } from "express";
import {
  createBid,
  getBidsForGig,
  getUserBids,
  hireBidder,
} from "../controllers/bidController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createBid);
router.get("/my/bids", protect, getUserBids);
router.get("/:gigId", protect, getBidsForGig);
router.patch("/:bidId/hire", protect, hireBidder);

export default router;
