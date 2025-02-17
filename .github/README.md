# ONDC Automation Cache Library

The ONDC Automation Cache Library is a utility designed for seamless integration with Redis. It provides a set of methods to easily interact with Redis for caching, managing keys, and working with Redis data structures.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  <!-- - [API Reference](#api-reference)
  - [redisService Methods](#redisService-methods)
  - [License](#license) -->

## Installation

To get started with the ONDC Automation Cache Library, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project folder:
3. Install the dependencies:

```sh
npm i
```

# automation-cache

A Redis-based caching library with multiple specialized cache services for different purposes.

## Installation

```bash
npm install ondc-automation-cache-lib
```

## Configuration

Create a `.env` file in your project root:

```env
REDIS_HOST=redis      # Use 'localhost' if running Redis locally
REDIS_PORT=6379
REDIS_USERNAME=       # Optional
REDIS_PASSWORD=       # Optional
```

## Usage

### Basic Redis Operations

```typescript
import { RedisService } from "ondc-automation-cache-lib";

// Basic key-value operations
await RedisService.setKey("example-key", "example-value");
const value = await RedisService.getKey("example-key");
const exists = await RedisService.keyExists("example-key");
await RedisService.deleteKey("example-key");

// Database selection
RedisService.useDb(0); // Switch to database 0

// Pub/Sub functionality
RedisService.subscribeToDb(0, (message) => {
  console.log("Received message:", message);
});
```

### Specialized Cache Services

The library provides several specialized cache services for different purposes:

#### API Service Cache (DB 0)

```typescript
import { ApiServiceCache, RedisService } from "ondc-automation-cache-lib";

const apiCache = new ApiServiceCache(RedisService);

// Session management
await apiCache.setSessionIdFromAPIService("sessionId", "sessionData");
const session = await apiCache.getSessionIdFromAPIService("sessionId");

// Subscriber management
await apiCache.setSubscriberCache("subscriberUrl", "subscriberData");
const subscriber = await apiCache.getSubscriberCache("subscriberUrl");

// Transaction management
await apiCache.setTransactionCache("txnId", "transactionData");
const transaction = await apiCache.getTransactionCache("txnId");
```

#### Mock Service Cache (DB 1)

```typescript
import { MockServiceCache, RedisService } from "ondc-automation-cache-lib";

const mockCache = new MockServiceCache(RedisService);
await mockCache.setMockData("mockId", "mockData");
const mockData = await mockCache.getMockData("mockId");
```

#### Reporting Cache Service (DB 2)

```typescript
import { ReportingCacheService, RedisService } from "ondc-automation-cache-lib";

const reportingCache = new ReportingCacheService(RedisService);
await reportingCache.setReportingData("reportId", "reportData");
const reportData = await reportingCache.getReportingData("reportId");
```

#### Config Cache Service (DB 3)

```typescript
import { ConfigCacheService, RedisService } from "ondc-automation-cache-lib";

const configCache = new ConfigCacheService(RedisService);
await configCache.setConfigData("configId", "configData");
const configData = await configCache.getConfigData("configId");
```

#### Console Cache Service (DB 4)

```typescript
import { ConsoleCacheService, RedisService } from "ondc-automation-cache-lib";

const consoleCache = new ConsoleCacheService(RedisService);
await consoleCache.setConsoleData("consoleId", "consoleData");
const consoleData = await consoleCache.getConsoleData("consoleId");
```

## Database Index Map

- DB 0: API Service Cache
- DB 1: Mock Service Cache
- DB 2: Reporting Cache Service
- DB 3: Config Cache Service
- DB 4: Console Cache Service

## Docker Support

If you're using Docker, include Redis in your docker-compose.yml:

```yaml
services:
  redis:
    image: redis:6.2
    container_name: redis
    ports:
      - "6379:6379"
    networks:
      - automation-network
```

## Cleanup

To properly close Redis connections (important for testing):

```typescript
await RedisService.disconnect();
```

## Error Handling

All cache operations return `null` or `false` on failure rather than throwing errors. Check return values to handle errors appropriately.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

```js
import { RedisService } from "ondc-automation-cache-lib";

// Select and use database 0
RedisService.useDb(0);

// subscribe to the db and listen to the message
RedisService.subscribeToDb(0, (message) => {
  console.log("message", message);
});

(async () => {
  // Set a key with TTL
  const setResult = await RedisService.setKey(
    "example-key",
    "example-value",
    3600
  );
  console.log("Set key result:", setResult); // Outputs: true

  // Get a key
  const value = await RedisService.getKey("example-key");
  console.log("Value:", value); // Outputs: example-value

  // Check if a key exists
  const exists = await RedisService.keyExists("example-key");
  console.log("Key exists:", exists); // Outputs: true

  // Delete a key
  const deleteResult = await RedisService.deleteKey("example-key");
  console.log("Delete key result:", deleteResult); // Outputs: true

  // Check if the key exists after deletion
  const existsAfterDelete = await RedisService.keyExists("example-key");
  console.log("Key exists after delete:", existsAfterDelete); // Outputs: false
})();
```
