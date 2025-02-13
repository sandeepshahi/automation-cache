import InstanceManager from "../utils/instanceManager";
import { Redis } from "ioredis";

class RedisService {
  private redis: Redis | null = null;
  private subscriber: Redis | null = null;

  useDb(dbIndex: number): void {
    this.redis = InstanceManager.useDb(dbIndex);
  }

  private checkInstance(): void {
    if (!this.redis) {
      throw new Error("No Redis database selected. Call useDb(dbIndex) first.");
    }
  }

  getCurrentDb(): number | undefined {
    this.checkInstance();
    return this.redis!.options.db;
  }

  //publish changes to channel
  private async publishChange(channel: string, key: string): Promise<void> {
    this.checkInstance();
    const dbIndex = this.redis!.options.db;
    const message = JSON.stringify({ channel, dbIndex, key });

    console.log(`Publishing: ${message}`);
    await this.redis!.publish(`db-${dbIndex}`, message);
  }

  //subscribe
  async subscribeToDb(
    dbIndex: number,
    callback: (message: any) => void
  ): Promise<void> {
    // if (!this.subscriber) {
    //   throw new Error("Subscriber instance is not initialized.");
    // }
    if (!this.subscriber) {
      this.subscriber = new Redis({
        host: this.redis?.options.host,
        port: this.redis?.options.port,
        username: this.redis?.options.username,
        password: this.redis?.options.password,
      });
    }

    const channel = `db-${dbIndex}`;
    this.subscriber.subscribe(channel, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${channel}:`, err);
      } else {
        console.log(`Subscribed to ${channel}`);
      }
    });

    this.subscriber.on("message", (_, message) => {
      callback(JSON.parse(message));
    });
  }

  async setKey(
    key: string,
    value: string,
    ttl: number | null = null
  ): Promise<boolean> {
    this.checkInstance();
    try {
      if (ttl) {
        await this.redis!.set(key, value, "EX", ttl);
      } else {
        await this.redis!.set(key, value);
      }
      await this.publishChange("SET", key);
      return true;
    } catch {
      return false;
    }
  }

  async getKey(key: string): Promise<string | null> {
    this.checkInstance();
    try {
      return this.redis!.get(key);
    } catch {
      return null;
    }
  }

  async deleteKey(key: string): Promise<boolean> {
    this.checkInstance();
    try {
      const result = await this.redis!.del(key);
      if (result > 0) await this.publishChange("DELETE", key);
      return result > 0; // Returns true if the key was deleted
    } catch {
      return false;
    }
  }
  async keyExists(key: string): Promise<boolean> {
    this.checkInstance();
    try {
      const exists = await this.redis!.exists(key);
      return exists > 0; // Returns true if the key exists
    } catch {
      return false;
    }
  }

  async getAllKeys(pattern: string = "*"): Promise<string[] | null> {
    this.checkInstance();
    try {
      return await this.redis!.keys(pattern);
    } catch (error) {
      console.error("Error fetching keys:", error);
      return null;
    }
  }

  // async addToSet(setKey: string, ...values: string[]): Promise<boolean> {
  //   this.checkInstance();
  //   try {
  //     await this.redis!.sadd(setKey, ...values);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  // async getSetMembers(setKey: string): Promise<string[] | null> {
  //   this.checkInstance();
  //   try {
  //     return this.redis!.smembers(setKey);
  //   } catch {
  //     return null;
  //   }
  // }

  // async removeFromSet(setKey: string, ...values: string[]): Promise<boolean> {
  //   this.checkInstance();
  //   try {
  //     const result = await this.redis!.srem(setKey, ...values);
  //     return result > 0; // Returns true if values were removed
  //   } catch {
  //     return false;
  //   }
  // }

  // async setExists(setKey: string): Promise<boolean> {
  //   this.checkInstance();
  //   try {
  //     const exists = await this.redis!.exists(setKey);
  //     return exists > 0; // Returns true if the set exists
  //   } catch {
  //     return false;
  //   }
  // }

  // New disconnect method to close Redis connections and avoid open handles during tests.
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }
  }
}

export default new RedisService();
