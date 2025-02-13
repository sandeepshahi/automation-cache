import { BaseCacheService } from "./baseCacheService";
import RedisService from "./redisService";
type RedisServiceType = typeof RedisService;


export class ConfigCacheService extends BaseCacheService {
  constructor(redisService: RedisServiceType) {
    super(3, redisService); // db2 for Mock Service
  }


  async getConfigData(configId: string): Promise<string | null> {
    return this.getKey(`config:${configId}`);
  }

  async setConfigData(configId: string, value: string) {
    return this.setKey(`config:${configId}`, value);
  }
}
