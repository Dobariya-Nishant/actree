import mongoose from "mongoose";
import { UnprocessableEntityError } from "../errors/app-errors";

export function getLimitAndSkip(pageNo: number) {
  const limit = 10;
  const skip = (pageNo - 1) * limit;
  return { limit, skip };
}

export function getObjectIds(ids: Array<string>) {
  return ids.map((id) => {
    if (!mongoose.isValidObjectId(id)) {
      throw new UnprocessableEntityError("not valid ObjectId");
    }
    return new mongoose.Types.ObjectId(id);
  });
}

export function getObjectId(id?: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new UnprocessableEntityError("not valid ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
}

export function generateObjectId() {
  return new mongoose.Types.ObjectId();
}

export function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

export function isS3Url(url: string | undefined) {
  const s3Regex =
    /^https:\/\/([a-z0-9.-]+)\.s3\.(amazonaws|s3)\.com(\/[^\s]*)?$/i;
  return s3Regex.test(url || "");
}

export function calculatePlatformFee(amount: number) {
  const sellerReceive = amount * 0.75;
  const platformFee = amount * 0.25;
  return { sellerReceive, platformFee };
}
