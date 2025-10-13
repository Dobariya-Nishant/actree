import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { postSuccess } from "@/domain/messages/success/post.message";
import { TransactionService } from "@/domain/service/transaction.service";

const streamToBuffer = async (stream: any) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

@injectable()
export class TransactionController {
  constructor(
    @inject("TransactionService") private transactionService: TransactionService
  ) {}

  async createAccount(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const url = await this.transactionService.createAccount(
      user.email,
      user._id
    );

    return h
      .response({
        statusCode: 201,
        data: url,
        message: postSuccess.CREATED,
      })
      .code(201);
  }

  async accountStatus(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const status = await this.transactionService.getAccountStatus(user._id);

    return h
      .response({
        statusCode: 200,
        data: status,
        message: postSuccess.UPDATE,
      })
      .code(200);
  }

  async checkOut(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const payment = await this.transactionService.checkOut(
      user._id,
      body.productId,
      body.tipAmount
    );

    return h
      .response({
        statusCode: 200,
        data: payment,
        message: postSuccess.SENT_POSTS,
      })
      .code(200);
  }

  async checkOutSuccess(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    //@ts-ignore
    const body = request.payload;
    const headers = request.headers as any;
    const stripeSignature = headers["stripe-signature"];

    if (!stripeSignature) return {};
    const rawBody = await streamToBuffer(request.payload);

    await this.transactionService.checkOutSuccess(rawBody, stripeSignature);

    return h
      .response({
        statusCode: 200,
      })
      .code(200);
  }

  async analytics(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    const analitics = await this.transactionService.getAanalitics({
      chartType: query.chartType,
      sellerId: user._id,
      FormDate: query.fromDate,
      toDate: query.toDate,
      year: query.year,
    });

    return h
      .response({
        statusCode: 200,
        data: analitics,
        message: postSuccess.SENT_POSTS,
      })
      .code(200);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    //@ts-ignore
    const query = request.query as any;

    if (query.transactionId) {
      const transaction = await this.transactionService.getOne(
        query.transactionId
      );

      return h
        .response({
          statusCode: 200,
          data: transaction,
          message: postSuccess.SENT_POSTS,
        })
        .code(200);
    }

    const transactions = await this.transactionService.get({
      buyerId: query.buyerId,
      sellerId: query.sellerId,
      createdAt: query.createdAt,
    });

    return h
      .response({
        statusCode: 200,
        data: transactions,
        message: postSuccess.SENT_POSTS,
      })
      .code(200);
  }

  async dashboard(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    // const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const url = await this.transactionService.getLoginLink(user._id);

    return h
      .response({
        statusCode: 200,
        data: url,
        message: postSuccess.SENT_POSTS,
      })
      .code(200);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    return h
      .response({
        statusCode: 204,
        message: postSuccess.DLETED,
      })
      .code(204);
  }
}
