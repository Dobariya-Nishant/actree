import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IUserService } from "@/domain/interface/service/user.service.interface";
import { User } from "@/domain/entities/user.entity";
import {
  AuthTypeEnum,
  FollowStatusTypeEnum,
  UserTypeEnum,
} from "@/domain/enum/user.enum";
import { userSuccess } from "@/domain/messages/success/user.message";
import { googleOauthURL } from "@/infrastructure/oauth/google/oauth_urls";
import { getGoogleProfile } from "@/infrastructure/oauth/google/get-token";
import { IFollowService } from "@/domain/interface/service/follow.service.interface";
import { generateObjectId } from "@/domain/helpers/util";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { userError } from "@/domain/messages/error/user.error";

@injectable()
export class UserController {
  constructor(
    @inject("UserService")
    private userService: IUserService,
    @inject("FollowService")
    private followService: IFollowService
  ) {}

  async profile(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const { credentials: user } = request.auth;

    const requestedUser = await this.userService.getOne({
      email: query?.email,
      userId: query?.userId,
      userName: query?.userName,
    });
    //@ts-ignore
    if (
      requestedUser.isPrivate &&
      user?._id?.toString() !== requestedUser?._id?.toString()
    ) {
      const isFollowing = await this.followService.getOne(
        //@ts-ignore
        user._id,
        requestedUser._id,
        FollowStatusTypeEnum.FOLLOWING
      );

      if (!isFollowing) {
        //@ts-ignore
        requestedUser.isShowProfile = false;
        return h
          .response({
            statusCode: 200,
            data: requestedUser,
            message: userSuccess.SENT,
          })
          .code(200);
      }
    }

    //@ts-ignore
    requestedUser.isShowProfile = true;

    return h
      .response({
        statusCode: 200,
        data: requestedUser,
        message: userSuccess.SENT,
      })
      .code(200);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth;

    let followingIds: string[] = [];

    const users = await this.userService.get({
      userIds: body.userIds,
      createdAt: body.createdAt,
    });

    if (!users) {
      return h
        .response({
          statusCode: 200,
          data: [],
          message: userSuccess.SENT_USERS,
        })
        .code(200);
    }

    if (user._id) {
      followingIds = await this.followService.getFollowingsIds(
        user._id as string
      );

      for (const userObj of users) {
        const isFollowed = followingIds.find((userId) => {
          const userID = userObj?._id?.toString();
          userId = userId?.toString();
          return userId === userID;
        });

        if (isFollowed) {
          //@ts-ignore
          userObj.isFollowed = true;
          continue;
        }
        //@ts-ignore
        userObj.isFollowed = false;
      }
    }

    return h
      .response({
        statusCode: 200,
        data: users,
        message: userSuccess.SENT_USERS,
      })
      .code(200);
  }

  async getSuggestedUsers(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const { credentials: user } = request.auth as any;

    const followingIds = await this.followService.getFollowingsIds(user._id);

    const users = await this.userService.get({
      excludeUserIds: followingIds,
    });

    return h
      .response({
        statusCode: 200,
        data: users,
        message: userSuccess.SENT_USERS,
      })
      .code(200);
  }

  async signUp(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const user: User = {
      //@ts-ignore
      _id: generateObjectId(),
      email: body.email,
      userName: body.userName,
      password: body.password,
      type: body?.type,
      bio: body?.bio,
      address: body?.address,
      phoneNumber: body?.phoneNumber,
      businessName: body?.businessName,
      dateOfBirth: body?.dateOfBirth,
      fullName: body?.fullName,
      gender: body?.gender,
      operatingHours: body?.operatingHours,
      authType: AuthTypeEnum.LOCAL,
      location: body?.location,
      socialLinks: body?.socialLinks,
      interests: body?.interests,
      profilePicture: body?.profilePicture,
    };

    const newUser = await this.userService.create(user);

    return h
      .response({
        statusCode: 201,
        data: newUser,
        message: userSuccess.SIGN_UP,
      })
      .code(201);
  }

  async login(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const user = await this.userService.login(body.email, body.password);

    return h
      .response({
        statusCode: 200,
        data: user,
        message: userSuccess.LOGIN,
      })
      .code(200);
  }

  async oAuthRedirect(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const { authType, type } = request.query as any;

    let url;

    switch (authType) {
      case AuthTypeEnum.GOOGLE:
        url = googleOauthURL(type as UserTypeEnum);
        break;
      case AuthTypeEnum.FACEBOOK:
        url = googleOauthURL(type as UserTypeEnum);
        break;
      case AuthTypeEnum.APPLE:
        url = googleOauthURL(type as UserTypeEnum);
        break;
      default:
        throw new UnprocessableEntityError(userError.AUTH_TYPE_NOT_SUPPORTED);
    }

    return h
      .response({
        statusCode: 201,
        data: { url },
        message: userSuccess.LOGIN,
      })
      .code(201);
  }

  async oAuthCallBack(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const { code, type, authType } = request.query as any;
    let user: User;

    switch (authType) {
      case AuthTypeEnum.GOOGLE:
        const googleUser = await getGoogleProfile(code);
        user = {
          //@ts-ignore
          _id: generateObjectId(),
          email: googleUser.email,
          userName: googleUser.given_name,
          authType: AuthTypeEnum.GOOGLE,
          profilePicture: googleUser.picture,
          type: type,
        };
        break;
      // case AuthTypeEnum.FACEBOOK:
      //   const facebookUser = await getFaceBookProfile(code);
      //   user = {
      //     //@ts-ignore
      //     _id: generateObjectId(),
      //     email: facebookUser.email,
      //     userName: facebookUser.given_name,
      //     authType: AuthTypeEnum.GOOGLE,
      //     profilePicture: facebookUser.picture,
      //     type: type,
      //   };
      //   break;

      default:
        throw new UnprocessableEntityError(userError.AUTH_TYPE_NOT_SUPPORTED);
    }

    const logedInUser = await this.userService.oAuthSignUpOrLogin(user);

    if (logedInUser) {
      return h
        .response({
          statusCode: 201,
          data: logedInUser,
          message: userSuccess.LOGIN,
        })
        .code(201);
    }

    const newUserWithSession = await this.userService.create(user);

    return h
      .response({
        statusCode: 201,
        data: newUserWithSession,
        message: userSuccess.LOGIN,
      })
      .code(201);
  }

  async update(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const {
      userId,
      bio,
      address,
      phoneNumber,
      businessName,
      dateOfBirth,
      fullName,
      gender,
      socialLinks,
      userName,
      interests,
      profilePicture,
      location,
      isPrivate,
    } = request.payload as any;

    let user: Partial<User> = {
      ...(bio && { bio }),
      ...(address && { address }),
      ...(userName && { userName }),
      ...(phoneNumber && { phoneNumber }),
      ...(businessName && { businessName }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(fullName && { fullName }),
      ...(gender && { gender }),
      ...(socialLinks && { socialLinks }),
      ...(location && { location }),
      ...(interests && { interests }),
      ...(typeof isPrivate === "boolean" && { isPrivate }),
    };

    const updatedUser = await this.userService.update(
      userId,
      user,
      profilePicture
    );

    return h
      .response({
        statusCode: 201,
        data: updatedUser,
        message: userSuccess.UPDATE,
      })
      .code(201);
  }

  async logout(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    //@ts-ignore
    const token = request?.auth?.token;
    const { credentials: user } = request.auth as any;

    const session = user?.sessions?.find(
      //@ts-ignore
      (obj) => obj.token === request?.auth?.token
    );

    await this.userService.logout(user._id, session._id);

    return h
      .response({
        statusCode: 201,
        message: userSuccess.LOGOUT,
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const deletedUser = await this.userService.delete({
      email: body.email,
      userId: body.userId || user._Id,
    });

    return h
      .response({
        statusCode: 201,
        data: deletedUser,
        message: userSuccess.DELETED,
      })
      .code(201);
  }
}
