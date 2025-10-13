import { injectable } from "tsyringe";
import { ReportModel } from "@/infrastructure/database/models/report.model";
import { getObjectId } from "@/domain/helpers/util";
import { ContentTypeEnum } from "@/domain/enum/post.enum";
import { ReportTypeEnum } from "@/domain/enum/report.enum";
import { Report } from "@/domain/entities/report.entity";
import { userProjectionString } from "./projections/user.projection";

@injectable()
export class ReportRepository {
  getOne(
    reportId: string,
    contentType: ContentTypeEnum
  ): Promise<Report | null> {
    const reportObjectId = getObjectId(reportId);

    switch (contentType) {
      case ContentTypeEnum.POST:
        return ReportModel.findOne({
          _id: reportObjectId,
        })
          .populate({
            path: "post",
          })
          .populate({
            path: "user",
            select: userProjectionString,
          })
          .lean();

      case ContentTypeEnum.COMMENT:
        return ReportModel.findOne({
          _id: reportObjectId,
        })
          .populate({
            path: "comment",
          })
          .populate({
            path: "user",
            select: userProjectionString,
          })
          .lean();
    }
  }

  getCounts({
    userId,
    contentType,
    type,
  }: {
    userId?: string;
    contentType?: ContentTypeEnum;
    type?: ReportTypeEnum;
  }): Promise<any> {
    const matchStage: any = {};

    if (userId) {
      matchStage.userId = userId;
    }

    if (contentType) {
      matchStage.contentType = contentType;
    }

    if (type) {
      matchStage.type = type;
    }

    return ReportModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  get({
    type,
    contentType,
    createdAt,
  }: {
    type?: ReportTypeEnum;
    contentType?: ContentTypeEnum;
    createdAt?: Date;
  }): Promise<Report[]> {
    if (createdAt) {
      createdAt = new Date(createdAt);
    } else {
      createdAt = new Date();
    }

    // switch (contentType) {
    //   case ContentTypeEnum.POST:
    //     return ReportModel.find({
    //       createdAt: { $lt: createdAt },
    //       ...(type && { type }),
    //       ...(contentType && { contentType }),
    //     })
    //       .populate({
    //         path: "post",
    //       })
    //       .populate({
    //         path: "user",
    //         select: userProjectionString,
    //       })
    //       .sort({ createdAt: -1 })
    //       .lean();

    //   case ContentTypeEnum.COMMENT:
    //     return ReportModel.find({
    //       createdAt: { $lt: createdAt },
    //       ...(type && { type }),
    //       ...(contentType && { contentType }),
    //     })
    //       .populate({
    //         path: "comment",
    //       })
    //       .populate({
    //         path: "user",
    //         select: userProjectionString,
    //       })
    //       .sort({ createdAt: -1 })
    //       .lean();
    // }

    // throw new UnprocessableEntityError(`${contentType} is not supported`);
    return ReportModel.find({
      createdAt: { $lt: createdAt },
      ...(type && { type }),
      ...(contentType && { contentType }),
    })
      .populate({
        path: "post",
      })
      .populate({
        path: "comment",
      })
      .populate({
        path: "user",
        select: userProjectionString,
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  create(report: Report): Promise<Report> {
    return ReportModel.create(report);
  }

  update(
    reportId: string,
    reportUpdate: Partial<Report>
  ): Promise<Report | null> {
    return ReportModel.findOneAndUpdate({ _id: reportId }, reportUpdate, {
      new: true,
    }).lean();
  }

  async delete(reportId: string): Promise<void> {
    await ReportModel.deleteOne({ _id: reportId });
  }
}
