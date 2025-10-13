import { inject, injectable } from "tsyringe";
import { Pin } from "@/domain/entities/pin.entity";
import { InternalServerError, NotFoundError } from "@/domain/errors/app-errors";
import { IPinRepository } from "@/domain/interface/repositories/pin.repository.interface";
import { IPinService } from "@/domain/interface/service/pin.service.interface";

@injectable()
export class PinService implements IPinService {
  constructor(@inject("PinRepository") private pinRepository: IPinRepository) {}

  async get(obj: { queryUserId: string; userId: string }): Promise<Pin> {
    const pin = await this.pinRepository.get(obj);

    if (!pin) {
      throw new NotFoundError("pin not found for this user");
    }

    return pin;
  }

  async create(obj: { userId: string; postId: string }): Promise<Pin> {
    const newLike = await this.pinRepository.create(obj);

    if (!newLike)
      throw new InternalServerError("something went wrong while adding pin");

    return newLike;
  }

  async delete(obj: { userId: string; postId: string }): Promise<Pin> {
    const deletedLike = await this.pinRepository.remove(obj);

    if (!deletedLike) throw new InternalServerError("Somthing Went Wrong!!");

    return deletedLike;
  }
}
