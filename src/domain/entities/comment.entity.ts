import { Media } from "@/domain/entities/media.entity";

export interface Comment {
  _id: string;
  userId: string;
  postId: string;
  content?: string;
  isEdited: boolean;
  media?: Array<Media>;
  createdAt?: Date;
  updatedAt?: Date;
}
