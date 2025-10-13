import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { Report } from "@/domain/entities/report.entity";
import { generateObjectId } from "@/domain/helpers/util";
import { ReportService } from "@/domain/service/report.service";
import { postSuccess } from "@/domain/messages/success/post.message";

@injectable()
export class ReportController {
  constructor(@inject("ReportService") private reportService: ReportService) {}

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const report: Report = {
      //@ts-ignore
      _id: generateObjectId(),
      userId: user._id,
      type: body.type,
      contentType: body.contentType,
      contentId: body.contentId,
    };

    const newPost = await this.reportService.create(report);

    return h
      .response({
        statusCode: 201,
        data: newPost,
        message: postSuccess.CREATED,
      })
      .code(201);
  }

  async update(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const report: Partial<Report> = {
      ...(body.contentId && { contentId: body.contentId }),
      ...(body.type && { type: body.type }),
      ...(body.contentType && { contentType: body.contentType }),
    };

    const updatedPost = await this.reportService.update(body.reportId, report);

    return h
      .response({
        statusCode: 201,
        data: updatedPost,
        message: postSuccess.UPDATE,
      })
      .code(201);
  }

  async getCounts(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    const counts = await this.reportService.getCounts({
      userId: query.userId,
      contentType: query.contentType,
      type: query.type,
    });

    return h
      .response({
        statusCode: 200,
        data: counts,
        message: postSuccess.SENT,
      })
      .code(200);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;

    if (query.reportId) {
      const report = await this.reportService.getOne(
        query.reportId,
        query.contentType
      );

      return h
        .response({
          statusCode: 200,
          data: report,
          message: postSuccess.SENT,
        })
        .code(200);
    }

    const reportList = await this.reportService.get({
      contentType: query.contentType,
      type: query.type,
      createdAt: query.createdAt,
    });

    const report = reportList[reportList.length - 1];

    const reports = {
      reportList: reportList,
      createdAt: report?.createdAt,
    };

    return h
      .response({
        statusCode: 200,
        data: reports,
        message: postSuccess.SENT_POSTS,
      })
      .code(200);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const deletedPost = await this.reportService.delete(body.reportId);

    return h
      .response({
        statusCode: 201,
        message: postSuccess.DLETED,
      })
      .code(201);
  }
}
