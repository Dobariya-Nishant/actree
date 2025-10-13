import { inject, injectable } from "tsyringe";
import {
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";
import { TransactionRepository } from "@/infrastructure/database/repositories/transaction.repository";
import { Transaction } from "@/domain/entities/transaction.entity";
import { StripePaymentProcessor } from "@/infrastructure/payment-processor/stripe/payment-processor";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { IProductService } from "@/domain/interface/service/product.service.interface";
import { ChartTypeEnum, PaymentStatus } from "@/domain/enum/transaction.enum";
import { generateObjectId } from "@/domain/helpers/util";
import { NotificationService } from "@/domain/service/notification.service";
import { NotificationTypeEnum } from "@/domain/enum/notification.enum";

@injectable()
export class TransactionService {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: TransactionRepository,
    @inject("UserService")
    private userService: IUserService,
    @inject("NotificationService")
    private notificationService: NotificationService,
    @inject("ProductService")
    private productService: IProductService,
    @inject("PaymentProcessor")
    private paymentProcessor: StripePaymentProcessor
  ) {}

  async createAccount(email: string, userId: string): Promise<string> {
    const user = await this.userService.getOne({ userId });

    if (!user.accountId) {
      user.accountId = await this.paymentProcessor.create(email);
    }

    const accountStatus = await this.paymentProcessor.getAccountStatus(
      user.accountId
    );

    if (accountStatus.payoutsEnabled && accountStatus.isActive) {
      throw new UnprocessableEntityError("account is already active");
    }

    const url = await this.paymentProcessor.createAccountLink(user.accountId);

    await this.userService.update(userId, { accountId: user.accountId });

    return url;
  }

  async getAccountStatus(userId: string) {
    const user = await this.userService.getOne({ userId });

    if (!user.accountId) {
      throw new NotFoundError("account not exist!!");
    }

    const accountStatus = await this.paymentProcessor.getAccountStatus(
      user.accountId
    );

    return accountStatus;
  }

  async getAanalitics({
    chartType,
    sellerId,
    FormDate,
    toDate,
    year,
  }: {
    chartType: ChartTypeEnum;
    sellerId: string;
    FormDate: Date;
    toDate: Date;
    year: string;
  }) {
    const salesAnalitics = await this.transactionRepository.getSalesAnalytics(
      sellerId,
      FormDate,
      toDate
    );

    const orderAnalitics = await this.transactionRepository.getOrderAnalytics(
      sellerId,
      FormDate,
      toDate
    );

    const productAnalitics =
      await this.transactionRepository.getProductAnalytics(
        sellerId,
        FormDate,
        toDate
      );

    const revenueAnalitics =
      await this.transactionRepository.getRevenueAnalitics(sellerId, year);

    return {
      salesAnalitics,
      orderAnalitics,
      productAnalitics,
      revenueAnalitics,
    };
  }

  async getLoginLink(userId: string) {
    const user = await this.userService.getOne({ userId });

    if (!user.accountId) {
      throw new NotFoundError("account not exist!!");
    }

    const accountStatus = await this.paymentProcessor.getLoginLink(
      user.accountId
    );

    return accountStatus;
  }

  async checkOut(userId: string, productId: string, tipAmount?: string) {
    const product = await this.productService.getById(productId);

    if (!product) {
      throw new NotFoundError("product not exist!!");
    }

    if (!product?.seller || !product?.seller?.accountId) {
      throw new NotFoundError("seller account not exist!!");
    }

    const transactionObj = await this.paymentProcessor.checkOut({
      product: product,
      buyerId: userId,
      sellerId: product.seller._id,
      accountId: product.seller.accountId,
      tipAmount: tipAmount,
    });

    return transactionObj;
  }

  async checkOutSuccess(body: any, signature: string) {
    const { isPaymentSuccess, metadata } =
      await this.paymentProcessor.isPaymentSuccess(body, signature);

    if (isPaymentSuccess && metadata) {
      const transaction: Transaction = {
        //@ts-ignore
        _id: generateObjectId(),
        buyerId: metadata?.buyerId,
        sellerId: metadata.sellerId,
        productId: metadata.productId,
        amount: Number(metadata.priceAmount),
        totalAmount: Number(metadata.totalAmount),
        platformFeeAmount: Number(metadata.platformFeeAmount),
        tipAmount: Number(metadata.tipAmount),
        taxAmount: Number(metadata.taxAmount),
        stripeFee: Number(metadata.stripeFee),
        paymentStatus: PaymentStatus.COMPLETED,
        paymentDate: new Date(),
      };

      const newTransaction = await this.create(transaction);

      return newTransaction;
    }
  }

  get({
    buyerId,
    sellerId,
    createdAt,
  }: {
    buyerId?: string;
    sellerId?: string;
    createdAt?: Date;
  }): Promise<Transaction[]> {
    const limit = 20;

    return this.transactionRepository.get({
      buyerId,
      sellerId,
      createdAt,
      limit,
    });
  }

  async getOne(transactionId: string): Promise<Transaction> {
    const user = await this.transactionRepository.getOne(transactionId);

    if (!user) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return user;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const newTransaction = await this.transactionRepository.create(transaction);

    const Transaction = await this.transactionRepository.getOne(
      transaction._id
    );

    await Promise.all([
      this.notificationService.create(
        transaction.buyerId,
        //@ts-ignore
        `product ${Transaction?.product?.name} purchased successfully`,
        NotificationTypeEnum.PRODUCT_PURCHASED
      ),
      this.notificationService.create(
        transaction.sellerId,
        //@ts-ignore
        `product ${Transaction?.product?.name} is purchased by ${Transaction?.buyer?.fullName}`,
        NotificationTypeEnum.PRODUCT_SOLD
      ),
    ]);

    return newTransaction;
  }

  async update(
    transactionId: string,
    userUpdate: Partial<Transaction>
  ): Promise<Transaction> {
    const transaction = await this.getOne(transactionId);

    if (!transaction) {
      throw new NotFoundError("transaction not Found");
    }

    const updatedTransaction = await this.transactionRepository.update(
      transactionId,
      userUpdate
    );

    if (!updatedTransaction) {
      throw new InternalServerError(
        "something went wrong while updating transaction"
      );
    }

    return updatedTransaction;
  }

  delete(transactionId: string): Promise<void> {
    return this.transactionRepository.delete(transactionId);
  }
}
