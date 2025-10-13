import { FollowStatusTypeEnum } from "@/domain/enum/user.enum";

export interface Follow {
  status: FollowStatusTypeEnum;
  followerId: string;
  followedId: string;
  createdAt?: string;
  updatedAt?: string;
}
