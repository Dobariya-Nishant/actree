import { User } from "@/domain/entities/user.entity";

export interface IUserService {
  get({
    userIds,
    excludeUserIds,
    createdAt,
  }: {
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
    createdAt?: Date;
  }): Promise<User[]>;

  getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User>;

  create(user: User, profilePicture?: any): Promise<User>;

  login(email: string, password: string): Promise<User>;

  oAuthSignUpOrLogin(user: User): Promise<User | null>;

  logout(userId: string, sessionId: string): Promise<User>;

  update(
    userId: string,
    user: Partial<User>,
    profilePicture?: any
  ): Promise<User>;

  incrementFollowerCount(userId: string): Promise<void>;

  incrementFollowingCount(userId: string): Promise<void>;

  decrementFollowerCount(userId: string): Promise<void>;

  decrementFollowingCount(userId: string): Promise<void>;

  delete({ email, userId }: { email?: string; userId?: string }): Promise<User>;

  isUser(email: string, userName?: string): Promise<Boolean>;
}
