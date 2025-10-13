import { injectable } from "tsyringe";
import { getObjectId } from "@/domain/helpers/util";
import { TransactionModel } from "@/infrastructure/database/models/transaction.model";
import { Transaction } from "@/domain/entities/transaction.entity";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { userProjectionString } from "@/infrastructure/database/repositories/projections/user.projection";

@injectable()
export class TransactionRepository {
  getOne(transactionId: string): Promise<Transaction | null> {
    const transactionObjectId = getObjectId(transactionId);

    return TransactionModel.findOne({
      _id: transactionObjectId,
    })
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .populate({
        path: "buyer",
        select: userProjectionString,
      })
      .populate({
        path: "product",
      })
      .lean();
  }

  getSalesAnalytics(
    sellerId: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<any> {
    const now = new Date();

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startDate = fromDate || firstDayOfMonth;
    const endDate = toDate || lastDayOfMonth;

    return TransactionModel.aggregate([
      {
        $match: {
          sellerId: sellerId,
          paymentStatus: "completed",
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
          },
          totalSales: { $sum: "$totalAmount" },
          transactionCount: { $sum: 1 },
          platformFees: { $sum: "$platformFeeAmount" },
          tips: { $sum: { $ifNull: ["$tipAmount", 0] } },
          taxCollected: { $sum: { $ifNull: ["$taxAmount", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  getProductAnalytics(
    sellerId: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<any> {
    const now = new Date();

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startDate = fromDate || firstDayOfMonth;
    const endDate = toDate || lastDayOfMonth;

    return TransactionModel.aggregate([
      {
        $match: {
          sellerId: sellerId,
          paymentStatus: "completed",
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$productId",
          totalSales: { $sum: "$totalAmount" },
          transactionCount: { $sum: 1 },
          platformFees: { $sum: "$platformFeeAmount" },
          tips: { $sum: { $ifNull: ["$tipAmount", 0] } },
          taxCollected: { $sum: { $ifNull: ["$taxAmount", 0] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      { $sort: { totalSales: -1 } },
    ]);
  }

  getOrderAnalytics(sellerId: string, fromDate?: Date, toDate?: Date) {
    const now = new Date();

    const currentDay = now.getDay();

    const startOfWeek =
      fromDate ||
      new Date(
        now.setDate(now.getDate() - currentDay + (currentDay === 0 ? -6 : 1))
      );

    const endOfWeek =
      toDate ||
      new Date(new Date(startOfWeek).setDate(startOfWeek.getDate() + 6));

    return TransactionModel.aggregate([
      {
        $match: {
          sellerId: sellerId,
          paymentStatus: "completed",
          transactionDate: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$transactionDate" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          dayOfWeek: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" },
              ],
              default: "Unknown",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          dayOfWeek: 1,
          orderCount: 1,
        },
      },
    ]);
  }

  getRevenueAnalitics(sellerId: string, year: string) {
    const currentYear = year || new Date().getFullYear().toString();
    return TransactionModel.aggregate([
      {
        $match: {
          sellerId,
          paymentStatus: "completed",
          transactionDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalRevenue: 1,
        },
      },
    ]);
  }

  get({
    buyerId,
    sellerId,
    limit,
    createdAt,
  }: {
    buyerId?: string;
    sellerId?: string;
    limit?: number;
    createdAt?: Date;
  }): Promise<Transaction[]> {
    if (!buyerId && !sellerId) {
      throw new UnprocessableEntityError("buyer info or seller info required");
    }

    if (createdAt) {
      createdAt = new Date(createdAt);
    } else {
      createdAt = new Date();
    }

    return TransactionModel.find({
      // createdAt: { $lt: createdAt },
      ...(buyerId && { buyerId: getObjectId(buyerId) }),
      ...(sellerId && { sellerId: getObjectId(sellerId) }),
    })
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .populate({
        path: "buyer",
        select: userProjectionString,
      })
      .populate({
        path: "product",
      })
      .limit(limit || 0)
      .sort({ createdAt: -1 })
      .lean();
  }

  create(user: Transaction): Promise<Transaction> {
    return TransactionModel.create(user);
  }

  update(
    transactionId: string,
    transactionUpdate: Partial<Transaction>
  ): Promise<Transaction | null> {
    const transactionObjectId = getObjectId(transactionId);

    return TransactionModel.findOneAndUpdate(
      { _id: transactionObjectId },
      transactionUpdate,
      {
        new: true,
      }
    )
      .populate({
        path: "seller",
        select: userProjectionString,
      })
      .populate({
        path: "buyer",
        select: userProjectionString,
      })
      .populate({
        path: "product",
      })
      .lean();
  }

  async delete(transactionId: string): Promise<void> {
    const transactionObjectId = getObjectId(transactionId);

    await TransactionModel.deleteOne({ _id: transactionObjectId });
  }
}
