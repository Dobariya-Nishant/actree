import { inject, injectable } from "tsyringe";
import { ReportRepository } from "@/infrastructure/database/repositories/report.repository";
import { ReportTypeEnum } from "@/domain/enum/report.enum";
import { ContentTypeEnum } from "@/domain/enum/post.enum";
import { NotFoundError } from "@/domain/errors/app-errors";
import { Report } from "@/domain/entities/report.entity";

@injectable()
export class ReportService {
  constructor(
    @inject("ReportRepository") private reportRepository: ReportRepository
  ) {}

  async get({
    type,
    contentType,
    createdAt,
  }: {
    type?: ReportTypeEnum;
    contentType?: ContentTypeEnum;
    createdAt?: Date;
  }): Promise<Report[]> {
    const report = await this.reportRepository.get({
      type,
      contentType,
      createdAt,
    });

    if (!report.length) {
      throw new NotFoundError("report not found");
    }

    return report;
  }

  async getCounts({
    userId,
    contentType,
    type,
  }: {
    userId?: string;
    contentType?: ContentTypeEnum;
    type?: ReportTypeEnum;
  }): Promise<any> {
    const counts = await this.reportRepository.getCounts({
      userId,
      contentType,
      type,
    });

    if (!counts) {
      throw new NotFoundError("counts not found");
    }

    return counts;
  }

  async getOne(
    reportId: string,
    contentType: ContentTypeEnum
  ): Promise<Report> {
    const report = await this.reportRepository.getOne(reportId, contentType);

    if (!report) {
      throw new NotFoundError("report not found");
    }

    return report;
  }

  async create(report: Report): Promise<Report> {
    return this.reportRepository.create(report);
  }

  async update(reportId: string, report: Partial<Report>): Promise<Report> {
    const updatedReport = await this.reportRepository.update(reportId, report);

    if (!updatedReport) {
      throw new NotFoundError("update ");
    }

    return updatedReport;
  }

  async delete(reportId: string): Promise<void> {
    return this.reportRepository.delete(reportId);
  }
}
