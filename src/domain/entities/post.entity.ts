import { Media } from "@/domain/entities/media.entity";

export interface Post {
  _id: string;
  userId: string;
  isRePost: boolean;
  isDeleted: boolean;
  content?: string;
  media?: Array<Media>;
  isEdited: boolean;
  isPinned: boolean;
  orignalPostId?: string;
  repostCount?: number;
  commentCount?: number;
  likeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
