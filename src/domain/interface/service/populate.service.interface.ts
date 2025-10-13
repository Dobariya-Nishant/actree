export interface IPopulateService {
  users(data: any, token?: string): Promise<any[]>;
  usersForPost(data: any, token?: string): Promise<any[]>;
}
