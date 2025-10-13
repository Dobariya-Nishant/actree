import mongoose, { Schema } from "mongoose";
import { User } from "@/domain/entities/user.entity";
import {
  AuthTypeEnum,
  GenderEnum,
  RoleTypeEnum,
  UserTypeEnum,
} from "@/domain/enum/user.enum";
import { SocialLink } from "@/domain/entities/social-links.entity";
import { Session } from "@/domain/entities/session.entiry";

const SessionSchema: Schema = new Schema<Session>(
  {
    token: { type: String, required: true },
  },
  { timestamps: true }
);

const SocialLinkSchema: Schema = new Schema<SocialLink>(
  {
    url: { type: String, required: true },
    logoName: { type: String, required: true },
  },
  { timestamps: true }
);

const InterestSchema: Schema = new Schema(
  {
    category: { type: String, required: true },
    interests: { type: [String], required: true },
  },
  { timestamps: true }
);

const UserSchema: Schema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    userName: { type: String, required: true, unique: true },
    postCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    interests: { type: [InterestSchema], default: [] },
    authType: { type: String, default: AuthTypeEnum.LOCAL },
    scope: { type: [String], default: [RoleTypeEnum.USER] },
    type: { type: String, default: UserTypeEnum.INDIVIDUAL },
    profilePicture: { type: String },
    bio: { type: String },
    sessions: { type: [SessionSchema], default: [] },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    isVerified: { type: Boolean, default: false },
    fullName: { type: String },
    gender: { type: String, default: GenderEnum.MALE },
    isPrivate: { type: Boolean, default: false },
    operatingHours: { type: String },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    businessName: { type: String },
    location: { type: String },
    address: { type: String },
    accountId: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", UserSchema);
