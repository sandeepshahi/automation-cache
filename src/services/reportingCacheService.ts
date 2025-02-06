import { BaseCacheService } from "./baseCacheService";
import RedisService from "./redisService";
type RedisServiceType = typeof RedisService;


export class ReportingCacheService extends BaseCacheService {
  constructor(redisService: RedisServiceType) {
    super(2, redisService); // db2 for Mock Service
  }


  async getReportingData(reportingId: string): Promise<string | null> {
    return this.getKey(`reporting:${reportingId}`);
  }

  async setReportingData(reportingId: string, value: string) {
    return this.setKey(`reporting:${reportingId}`, value);
  }
}
