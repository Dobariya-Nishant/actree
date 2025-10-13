import { Follow } from "@/domain/entities/follow.entity";
import { FollowStatusTypeEnum } from "@/domain/enum/user.enum";
import mongoose, { Schema } from "mongoose";

const FollowSchema: Schema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: FollowStatusTypeEnum,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

FollowSchema.index({ followerId: 1, followedId: 1 }, { unique: true });

FollowSchema.index({ status: 1, followerId: 1 });

FollowSchema.index({ status: 1, followedId: 1 });

FollowSchema.virtual("followedUser", {
  ref: "User",
  localField: "followedId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

FollowSchema.virtual("followerUser", {
  ref: "User",
  localField: "followerId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

export const FollowModel = mongoose.model<Follow>("Follow", FollowSchema);
