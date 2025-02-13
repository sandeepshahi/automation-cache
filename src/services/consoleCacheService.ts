import { BaseCacheService } from "./baseCacheService";
import RedisService from "./redisService";
type RedisServiceType = typeof RedisService;


export class ConsoleCacheService extends BaseCacheService {
  constructor(redisService: RedisServiceType) {
    super(4, redisService); // db2 for Mock Service
  }


  async getConsoleData(consoleId: string): Promise<string | null> {
    return this.getKey(`console:${consoleId}`);
  }

  async setConsoleData(consoleId: string, value: string) {
    return this.setKey(`console:${consoleId}`, value);
  }
}
