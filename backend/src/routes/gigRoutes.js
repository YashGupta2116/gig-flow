import Router from "express";
import { protect } from "../middleware/auth.middleware";
import {
  createGig,
  getGigById,
  getGigs,
  getMyGigs,
} from "../controllers/gigsController";

const router = Router();

router.get("/", getGigs);
router.get("/my/posted", protect, getMyGigs);
router.get("/:id", getGigById);
router.post("/", protect, createGig);

export default router;
