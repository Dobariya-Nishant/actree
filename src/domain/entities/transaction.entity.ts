export interface Transaction {
  _id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  amount: number;
  totalAmount: number;
  platformFeeAmount: number;
  tipAmount?: number;
  taxAmount?: number;
  paymentStatus: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  transactionId?: string;
  paymentDate?: Date;
}
