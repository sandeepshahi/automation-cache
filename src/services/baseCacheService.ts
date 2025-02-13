import RedisService from "./redisService";
type RedisServiceType = typeof RedisService;

interface ICacheService {
  getKey(key: string): Promise<string | null>;
  setKey(key: string, value: string): Promise<boolean>;
  deleteKey(key: string): Promise<boolean>;
}


export abstract class BaseCacheService implements ICacheService {
  constructor(
    protected dbIndex: number,
    protected redisService: RedisServiceType
  ) {}


  protected ensureDb(): void {
    this.redisService.useDb(this.dbIndex);
  }

  async getKey(key: string): Promise<string | null> {
    this.ensureDb();
    return this.redisService.getKey(key);
  }

  async setKey(key: string, value: string): Promise<boolean> {
    this.ensureDb();
    return this.redisService.setKey(key, value);
  }

  async deleteKey(key: string): Promise<boolean> {
    this.ensureDb();
    return this.redisService.deleteKey(key);
  }
}
