import { Pin } from "@/domain/entities/pin.entity";
import mongoose, { Schema } from "mongoose";

const PinSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pins: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

PinSchema.index({ userId: 1 }, { unique: true });

export const PinModel = mongoose.model<Pin>("Pin", PinSchema);
