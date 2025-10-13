import { Pin } from "@/domain/entities/pin.entity";

export interface IPinService {
  get(obj: { queryUserId: string; userId: string }): Promise<Pin>;

  create(obj: { userId: string; postId: string }): Promise<Pin>;

  delete(obj: { userId: string; postId: string }): Promise<Pin>;
}
