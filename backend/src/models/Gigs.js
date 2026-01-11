import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 0,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

gigSchema.index({ title: "text", description: "text" });

export const gigs = mongoose.model("gigs", gigSchema);
