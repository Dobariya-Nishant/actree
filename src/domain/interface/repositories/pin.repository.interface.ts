import { Pin } from "@/domain/entities/pin.entity";

export interface IPinRepository {
  get(obj: { queryUserId: string; userId: string }): Promise<Pin | null>;

  create({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<Pin | null>;

  remove({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<Pin | null>;
}
