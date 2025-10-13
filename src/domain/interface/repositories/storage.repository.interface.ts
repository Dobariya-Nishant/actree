import { MediaTypeEnum } from "@/domain/enum/user.enum";

export interface IStorageRepository {
  fileUpload({
    fileName,
    fileContent,
    fileUrl,
    contentType,
  }: {
    fileName: string;
    fileContent: any;
    fileUrl?: string;
    contentType: string;
  }): Promise<{
    url: string;
    type: MediaTypeEnum;
  }>;

  uploadFiles(
    userId: string,
    files: Array<any>
  ): Promise<
    {
      url: string;
      type: MediaTypeEnum;
    }[]
  >;

  deleteFiles(urls: Array<string>): Promise<void>;
}
