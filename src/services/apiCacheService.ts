import { BaseCacheService } from "./baseCacheService";
import RedisService from './redisService';
type RedisServiceType = typeof RedisService;

export class ApiServiceCache extends BaseCacheService {
    constructor(redisService: RedisServiceType) {
      super(0, redisService); // db0 for API Service

    }
  
    // Session Cache Methods
    async getSessionIdFromAPIService(sessionId: string): Promise<string | null> {
      return this.getKey(`sessionId:${sessionId}`);
    }
  
    async setSessionIdFromAPIService(sessionId: string, value: string): Promise<boolean> {
      return this.setKey(`sessionId:${sessionId}`, value);
    }
  
    // Subscriber Cache Methods
    async getSubscriberCache(subscriberUrl: string): Promise<string | null> {
      return this.getKey(`subscriberUrl:${subscriberUrl}`);
    }

    async setSubscriberCache(subscriberUrl: string, value: string): Promise<boolean> {
        return this.setKey(`subscriberUrl:${subscriberUrl}`, value);
    }
  
    // Transaction Cache Methods
    async getTransactionCache(txnId: string): Promise<string | null> {
      return this.getKey(`txnId:${txnId}`);
    }

    async setTransactionCache(txnId: string, value: string): Promise<boolean> {
        return this.setKey(`txnId:${txnId}`, value);
    }

  }
  