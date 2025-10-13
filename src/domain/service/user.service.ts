import { inject, injectable } from "tsyringe";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { IUserRepository } from "@/domain/interface/repositories/user.repository.interface";
import { User } from "@/domain/entities/user.entity";
import { IAuthService } from "@/domain/interface/service/auth.service.interface";
import { JwtPayload } from "@/domain/entities/jwt.entity";
import { Session } from "@/domain/entities/session.entiry";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { IOtpService } from "@/domain/interface/service/otp.service.interface";
import { userError } from "@/domain/messages/error/user.error";
import { otpError } from "@/domain/messages/error/otp.error";
import { generateObjectId, isS3Url, isValidUrl } from "@/domain/helpers/util";
import { generateUserName } from "@/domain/helpers/generateUserName";
import { IStorageRepository } from "@/domain/interface/repositories/storage.repository.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("AuthService")
    private authService: IAuthService,
    @inject("OtpService")
    private otpService: IOtpService,
    @inject("StorageRepository")
    private storageRepository: IStorageRepository
  ) {}

  get({
    userIds,
    excludeUserIds,
    createdAt,
  }: {
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
    createdAt?: Date;
  }): Promise<User[]> {
    const limit = 20;
    return this.userRepository.get({
      limit,
      createdAt,
      userIds,
      excludeUserIds,
    });
  }

  async getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User> {
    const user = await this.userRepository.getOne({ email, userId, userName });

    if (!user) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    return user;
  }

  async createSession(user: User): Promise<User> {
    const tokenPayload: JwtPayload = {
      userId: user._id as string,
      email: user.email,
      authType: user.authType,
      scope: user.scope,
      //@ts-ignore
      sessionId: generateObjectId(),
    };

    const sessionToken = this.authService.createSessionToken(tokenPayload);

    const session: Session = {
      _id: tokenPayload.sessionId,
      token: sessionToken,
    };

    const newUserWithSession = await this.userRepository.addSession(
      user._id,
      session
    );
    //@ts-ignore
    newUserWithSession.session = session;
    return newUserWithSession;
  }

  private async oAuthLogin(email: string): Promise<User | null> {
    const user = await this.userRepository.getOne({ email });

    if (!user || !user._id) {
      return null;
    }

    if (user.authType === AuthTypeEnum.LOCAL) {
      throw new UnprocessableEntityError(userError.LOGIN_LOCAL);
    }

    const userWithSession = await this.createSession(user);

    return userWithSession;
  }

  async oAuthSignUpOrLogin(user: User): Promise<User | null> {
    const newUser = await this.oAuthLogin(user.email);

    if (newUser) {
      return newUser;
    }

    user.userName = generateUserName(user.userName);

    const userWithSession = await this.create(user);

    return userWithSession;
  }

  async create(user: User): Promise<User> {
    const isExist = await this.isUser(user.email, user.userName);

    if (isExist) {
      throw new ConflictError(userError.ALREADY_EXIST);
    }

    if (user.authType === AuthTypeEnum.LOCAL) {
      if (!user.password) {
        throw new UnprocessableEntityError(userError.PASSWORD_REQURED);
      }

      const isOtpVerified = await this.otpService.isVerified(user.email);

      if (!isOtpVerified) {
        throw new UnprocessableEntityError(otpError.NOT_EXIST);
      }

      const encryptedPassword = this.authService.encryptPassword(user.password);

      if (user.profilePicture) {
        const [profileUrl] = await this.storageRepository.uploadFiles(
          user._id,
          [user.profilePicture]
        );
        user.profilePicture = profileUrl.url;
      }

      user.password = encryptedPassword;
    }

    const newUser = await this.userRepository.create(user);

    const userWithSession = await this.createSession(newUser);

    return userWithSession;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.getOne({ email });

    if (!user?._id) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    if (user.authType == AuthTypeEnum.GOOGLE || !user?.password) {
      throw new NotFoundError(userError.LOGIN_GOOGLE);
    }

    const isValidPassword = this.authService.verifyPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError(userError.INVALID_CREDENCIAL);
    }

    const userWithSession = await this.createSession(user);

    return userWithSession;
  }

  logout(userId: string, sessionId: string): Promise<User> {
    return this.userRepository.removeSession(userId, sessionId);
  }

  async update(
    userId: string,
    userUpdate: Partial<User>,
    profilePicture: any
  ): Promise<User> {
    const user = await this.getOne({ userId });

    if (profilePicture) {
      if (user?.profilePicture && isS3Url(user?.profilePicture)) {
        await this.storageRepository.deleteFiles([user.profilePicture]);
      }
      if (!isValidUrl(profilePicture)) {
        const [profileUrl] = await this.storageRepository.uploadFiles(
          user._id,
          [user.profilePicture]
        );
        user.profilePicture = profileUrl.url;
      }
      userUpdate.profilePicture = profilePicture;
    }

    return this.userRepository.update(userId, userUpdate);
  }

  incrementFollowerCount(userId: string): Promise<void> {
    return this.userRepository.updateFollowersCount(userId, 1);
  }

  incrementFollowingCount(userId: string): Promise<void> {
    return this.userRepository.updateFollowingsCount(userId, 1);
  }

  decrementFollowerCount(userId: string): Promise<void> {
    return this.userRepository.updateFollowersCount(userId, -1);
  }

  decrementFollowingCount(userId: string): Promise<void> {
    return this.userRepository.updateFollowingsCount(userId, -1);
  }

  delete({
    email,
    userId,
  }: {
    email?: string;
    userId?: string;
  }): Promise<User> {
    return this.userRepository.delete({ email, userId });
  }

  isUser(email: string, userName?: string): Promise<Boolean> {
    return this.userRepository.checkUserExist(email, userName);
  }
}
