import { container } from "tsyringe";
import { FollowRepository } from "@/infrastructure/database/repositories/follow.repository";
import { OtpRepository } from "@/infrastructure/database/repositories/otp.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { AuthService } from "@/domain/service/auth.service";
import { UserService } from "@/domain/service/user.service";
import { OtpService } from "@/domain/service/otp.service";
import { FollowService } from "@/domain/service/follow.service";
import { UserController } from "@/api/controllers/user.controller";
import { OtpController } from "@/api/controllers/otp.controller";
import { FollowController } from "@/api/controllers/follow.controller";
import { EmailService } from "@/domain/service/email.service";
import { StorageRepository } from "@/infrastructure/aws/s3/repositories/s3.repository";
import { PostController } from "@/api/controllers/post.controller";
import { RePostController } from "@/api/controllers/repost.controller";
import { LikeController } from "@/api/controllers/like.controller";
import { CommentController } from "@/api/controllers/comment.controller";
import { BookMarkController } from "@/api/controllers/bookmark.controller";
import { PinController } from "@/api/controllers/pin.controller";
import { RePostService } from "@/domain/service/repost.service";
import { PostService } from "@/domain/service/post.service";
import { LikeService } from "@/domain/service/like.service";
import { CommentService } from "@/domain/service/comment.service";
import { BookMarkService } from "@/domain/service/bookmark.service";
import { PinService } from "@/domain/service/pin.service";
import { PinRepository } from "@/infrastructure/database/repositories/pin.repository";
import { BookMarkRepository } from "@/infrastructure/database/repositories/bookmark.repository";
import { CommentRepository } from "@/infrastructure/database/repositories/comment.repository";
import { LikeRepository } from "@/infrastructure/database/repositories/like.repository";
import { PostRepository } from "@/infrastructure/database/repositories/post.repository";
import { ProductController } from "@/api/controllers/product.controller";
import { WishListController } from "@/api/controllers/wishlist.controller";
import { ProductService } from "@/domain/service/product.service";
import { WishListService } from "@/domain/service/wishlist.service";
import { ProductRepository } from "@/infrastructure/database/repositories/product.repository";
import { WishListRepository } from "@/infrastructure/database/repositories/wishlist.repository";
import { StripePaymentProcessor } from "@/infrastructure/payment-processor/stripe/payment-processor";
import { TransactionController } from "@/api/controllers/transaction.controller";
import { TransactionService } from "@/domain/service/transaction.service";
import { TransactionRepository } from "@/infrastructure/database/repositories/transaction.repository";
import { EmailController } from "@/api/controllers/email.controller";
import { ReportService } from "@/domain/service/report.service";
import { ReportRepository } from "@/infrastructure/database/repositories/report.repository";
import { ReportController } from "@/api/controllers/report.controller";
import { NotificationController } from "@/api/controllers/notification.controller";
import { NotificationService } from "@/domain/service/notification.service";
import { NotificationRepository } from "@/infrastructure/database/repositories/notificatin.repository";
import { SocketService } from "@/domain/service/socket.service";

// controllers registation
container.register("UserController", {
  useClass: UserController,
});
container.register("OtpController", {
  useClass: OtpController,
});
container.register("FollowController", {
  useClass: FollowController,
});
container.register("PostController", {
  useClass: PostController,
});
container.register("RePostController", {
  useClass: RePostController,
});
container.register("LikeController", {
  useClass: LikeController,
});
container.register("CommentController", {
  useClass: CommentController,
});
container.register("BookMarkController", {
  useClass: BookMarkController,
});
container.register("PinController", {
  useClass: PinController,
});
container.register("ProductController", {
  useClass: ProductController,
});
container.register("WishListController", {
  useClass: WishListController,
});
container.register("TransactionController", {
  useClass: TransactionController,
});
container.register("EmailController", {
  useClass: EmailController,
});
container.register("ReportController", {
  useClass: ReportController,
});
container.register("NotificationController", {
  useClass: NotificationController,
});

// services registation
container.register("UserService", {
  useClass: UserService,
});
container.register("AuthService", {
  useClass: AuthService,
});
container.register("OtpService", {
  useClass: OtpService,
});
container.register("EmailService", {
  useClass: EmailService,
});
container.register("FollowService", {
  useClass: FollowService,
});
container.register("PostService", {
  useClass: PostService,
});
container.register("RePostService", {
  useClass: RePostService,
});
container.register("LikeService", {
  useClass: LikeService,
});
container.register("CommentService", {
  useClass: CommentService,
});
container.register("BookMarkService", {
  useClass: BookMarkService,
});
container.register("PinService", {
  useClass: PinService,
});
container.register("ProductService", {
  useClass: ProductService,
});
container.register("WishListService", {
  useClass: WishListService,
});
container.register("TransactionService", {
  useClass: TransactionService,
});
container.register("ReportService", {
  useClass: ReportService,
});
container.register("NotificationService", {
  useClass: NotificationService,
});
container.register("SocketService", {
  useClass: SocketService,
});

//repository registation
container.register("UserRepository", {
  useClass: UserRepository,
});
container.register("FollowRepository", {
  useClass: FollowRepository,
});
container.register("OtpRepository", {
  useClass: OtpRepository,
});
container.register("StorageRepository", {
  useClass: StorageRepository,
});
container.register("PostRepository", {
  useClass: PostRepository,
});
container.register("LikeRepository", {
  useClass: LikeRepository,
});
container.register("CommentRepository", {
  useClass: CommentRepository,
});
container.register("BookMarkRepository", {
  useClass: BookMarkRepository,
});
container.register("PinRepository", {
  useClass: PinRepository,
});
container.register("ProductRepository", {
  useClass: ProductRepository,
});
container.register("WishListRepository", {
  useClass: WishListRepository,
});
container.register("TransactionRepository", {
  useClass: TransactionRepository,
});
container.register("ReportRepository", {
  useClass: ReportRepository,
});
container.register("NotificationRepository", {
  useClass: NotificationRepository,
});

// paymentProcessor
container.register("PaymentProcessor", {
  useClass: StripePaymentProcessor,
});

export default container;
