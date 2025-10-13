import { injectable } from "tsyringe";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { s3 } from "@/infrastructure/aws/s3/client";
import { env } from "@/config/env";
import { awsUrls } from "@/config/aws.s3";
import { IStorageRepository } from "@/domain/interface/repositories/storage.repository.interface";
import { MediaTypeEnum } from "@/domain/enum/user.enum";

@injectable()
export class StorageRepository implements IStorageRepository {
  client: S3Client;

  constructor() {
    this.client = s3;
  }

  async fileUpload({
    userId,
    fileName,
    fileContent,
    fileUrl,
    contentType,
  }: {
    userId: string;
    fileName: string;
    fileContent: any;
    fileUrl?: string;
    contentType: string;
  }) {
    //@ts-ignore
    let fileObj: { type: MediaTypeEnum; url: string } = {};

    const ebookFormats = [
      "application/epub+zip", // EPUB format
      "application/pdf", // PDF format
      "application/x-mobipocket-ebook", // MOBI format
      "application/x-amazon-azw", // AZW format
      "application/x-amazon-azw3", // AZW3 format
      "application/fb2+xml", // FB2 format
      "application/x-ms-reader", // LIT format
      "application/x-ibooks+zip", // iBooks format
      "application/vnd.comicbook+zip", // CBR format
      "application/vnd.comicbook-rar", // CBZ format
      "application/x-djvu", // DJVU format
    ];

    if (["video/mp4", "video/webm", "video/avi"].includes(contentType)) {
      fileObj.type = MediaTypeEnum.VIDEO;
    } else if (["image/jpeg", "image/png", "image/gif"].includes(contentType)) {
      fileObj.type = MediaTypeEnum.PHOTOS;
    } else if (["audio/mp3", "audio/wav"].includes(contentType)) {
      fileObj.type = MediaTypeEnum.AUDIO; // Added check for audio
    } else if (["font/woff", "font/woff2"].includes(contentType)) {
      fileObj.type = MediaTypeEnum.FONT; // Added check for font
    } else if (ebookFormats.includes(contentType)) {
      fileObj.type = MediaTypeEnum.EBOOK; // All eBook formats are handled here
    } else {
      throw new UnprocessableEntityError("file type is not supported");
    }

    let key = `${userId}/${randomUUID()}_${fileName}`;

    if (fileUrl) {
      const urlParts = fileUrl.split(awsUrls.S3_BUCKET_URL);

      if (urlParts.length !== 2) {
        throw new UnprocessableEntityError("Invalid S3 file URL.");
      }

      key = urlParts[1];
    }

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileContent,
      },
    });

    await upload.done();

    const url = `${awsUrls.S3_BUCKET_URL}${key}`;

    fileObj.url = url;

    return fileObj;
  }

  uploadFiles(userId: string, files: Array<any>) {
    if (!Array.isArray(files)) {
      files = [files];
    }
    const uploadPromises = files.map(async (file) => {
      const fileName = file.hapi.filename;
      const contentType = file.hapi.headers["content-type"];

      return this.fileUpload({
        userId: userId,
        fileName: fileName,
        fileContent: file,
        contentType: contentType,
      });
    });

    return Promise.all(uploadPromises);
  }

  async deleteFiles(urls: Array<string>): Promise<void> {
    if (!urls?.length) {
      return;
    }

    const objects = urls.map((url) => {
      const urlParts = url.split(awsUrls.S3_BUCKET_URL);

      if (urlParts.length !== 2) {
        throw new Error("Invalid S3 file URL.");
      }

      return { Key: urlParts[1] };
    });

    const deleteParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Delete: {
        Objects: objects,
        Quiet: false,
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);

    const response = await this.client.send(command);

    if (response.Errors && response.Errors.length > 0) {
      console.error("Errors occurred while deleting:", response.Errors);
      throw new UnprocessableEntityError("Some files could not be deleted.");
    }

    return;
  }
}
