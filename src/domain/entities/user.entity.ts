import { AuthTypeEnum, RoleTypeEnum } from "@/domain/enum/user.enum";
import { Session } from "@/domain/entities/session.entiry";
import { SocialLink } from "@/domain/entities/social-links.entity";
import { GenderEnum, UserTypeEnum } from "@/domain/enum/user.enum";

export interface User {
  _id: string;
  email: string;
  password?: string;
  userName: string;
  postCount?: number;
  followersCount?: number;
  followingCount?: number;
  authType: AuthTypeEnum;
  type: UserTypeEnum;
  scope: [RoleTypeEnum];
  profilePicture?: string;
  bio?: string;
  interests?: Array<string>;
  sessions?: Array<Session>;
  socialLinks?: Array<SocialLink>;
  isVerified?: boolean;
  fullName?: string;
  location?: string;
  gender?: GenderEnum;
  isPrivate?: boolean;
  operatingHours?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  businessName?: string;
  accountId?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
