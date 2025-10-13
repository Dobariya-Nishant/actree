import { ContentTypeEnum } from "../enum/post.enum";
import { ReportTypeEnum } from "../enum/report.enum";

export interface Report {
  _id: string;
  userId: string;
  type: ReportTypeEnum;
  contentType: ContentTypeEnum;
  contentId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
