import { BaseCacheService } from "./baseCacheService";
import RedisService from "./redisService";
type RedisServiceType = typeof RedisService;


export class MockServiceCache extends BaseCacheService {
  constructor(redisService: RedisServiceType) {
    super(1, redisService); // db1 for Mock Service
  }


  async getMockData(mockId: string): Promise<string | null> {
    return this.getKey(`mock:${mockId}`);
  }

  async setMockData(mockId: string, value: string) {
    return this.setKey(`mock:${mockId}`, value);
  }
}
