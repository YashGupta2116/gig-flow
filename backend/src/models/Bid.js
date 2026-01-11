import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gigs",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Bid message is required"],
    },
    price: {
      type: Number,
      required: [true, "Bid price is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "HIRED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export const bids = mongoose.model("bids", bidSchema);
