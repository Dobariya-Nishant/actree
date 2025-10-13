import { Post } from "@/domain/entities/post.entity";

export interface IRePostService {
  create(rePost: Post): Promise<Post>;

  update(postId: string, rePostUpdate: Partial<Post>): Promise<Post>;

  get(createdAt?: Date): Promise<Post[]>;

  getOne(postId: string): Promise<Post>;

  delete(postId: string): Promise<Post>;
}
