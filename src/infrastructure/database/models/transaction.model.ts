import { Transaction } from "@/domain/entities/transaction.entity";
import {
  PaymentMethodType,
  PaymentStatus,
} from "@/domain/enum/transaction.enum";
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    amount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    platformFeeAmount: { type: Number, required: true },
    tipAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    stripeFee: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethodType),
    },
    transactionIntentId: { type: String },
    transactionId: { type: String },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TransactionSchema.virtual("seller", {
  ref: "User",
  localField: "sellerId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

TransactionSchema.virtual("buyer", {
  ref: "User",
  localField: "buyerId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

TransactionSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
  limit: 1,
});

export const TransactionModel = mongoose.model<Transaction>(
  "Transaction",
  TransactionSchema
);
