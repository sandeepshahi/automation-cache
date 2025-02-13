import RedisService from '../redisService';
import { ApiServiceCache } from '../apiCacheService';
import { MockServiceCache } from '../mockCacheService';
import { ReportingCacheService } from '../reportingCacheService';
import { ConfigCacheService } from '../configCacheService';
import { ConsoleCacheService } from '../consoleCacheService';

describe('Cache Services Tests', () => {
  const apiCache = new ApiServiceCache(RedisService);
  const mockCache = new MockServiceCache(RedisService);
  const reportingCache = new ReportingCacheService(RedisService);
  const configCache = new ConfigCacheService(RedisService);
  const consoleCache = new ConsoleCacheService(RedisService);

  beforeEach(async () => {
    // Clean up keys used in existing tests
    await apiCache.deleteKey('sessionId:test');
    await mockCache.deleteKey('mock:test');
    await reportingCache.deleteKey('reporting:test');
    await configCache.deleteKey('config:test');
    await consoleCache.deleteKey('console:test');

    // Clean up keys for new tests
    await apiCache.deleteKey('subscriberUrl:test');
    await apiCache.deleteKey('txnId:test');
    await apiCache.deleteKey('keyExistsTest');
    await apiCache.deleteKey('nonExistingKey');
    await apiCache.deleteKey('nonExistingKey2');
  });

  test('ApiServiceCache - session operations', async () => {
    const testValue = 'test-session-data';
    await apiCache.setSessionIdFromAPIService('test', testValue);
    const result = await apiCache.getSessionIdFromAPIService('test');
    expect(result).toBe(testValue);
  });

  test('MockServiceCache operations', async () => {
    const testValue = 'test-mock-data';
    await mockCache.setMockData('test', testValue);
    const result = await mockCache.getMockData('test');
    expect(result).toBe(testValue);
  });

  test('ReportingCacheService operations', async () => {
    const testValue = 'test-reporting-data';
    await reportingCache.setReportingData('test', testValue);
    const result = await reportingCache.getReportingData('test');
    expect(result).toBe(testValue);
  });

  test('ConfigCacheService operations', async () => {
    const testValue = 'test-config-data';
    await configCache.setConfigData('test', testValue);
    const result = await configCache.getConfigData('test');
    expect(result).toBe(testValue);
  });

  test('ConsoleCacheService operations', async () => {
    const testValue = 'test-console-data';
    await consoleCache.setConsoleData('test', testValue);
    const result = await consoleCache.getConsoleData('test');
    expect(result).toBe(testValue);
  });

  test('Verify different DBs are used', async () => {
    // Set the same key in different services
    const key = 'test';
    const values = {
      api: 'api-value',
      mock: 'mock-value',
      reporting: 'reporting-value',
      config: 'config-value',
      console: 'console-value'
    };

    await Promise.all([
      apiCache.setSessionIdFromAPIService(key, values.api),
      mockCache.setMockData(key, values.mock),
      reportingCache.setReportingData(key, values.reporting),
      configCache.setConfigData(key, values.config),
      consoleCache.setConsoleData(key, values.console)
    ]);

    // Verify each service returns its own value
    const results = await Promise.all([
      apiCache.getSessionIdFromAPIService(key),
      mockCache.getMockData(key),
      reportingCache.getReportingData(key),
      configCache.getConfigData(key),
      consoleCache.getConsoleData(key)
    ]);

    expect(results[0]).toBe(values.api);
    expect(results[1]).toBe(values.mock);
    expect(results[2]).toBe(values.reporting);
    expect(results[3]).toBe(values.config);
    expect(results[4]).toBe(values.console);
  });

  // --- New tests to fully cover services ---

  // Test the subscriber operations in ApiServiceCache
  test('ApiServiceCache - subscriber operations', async () => {
    const testValue = 'subscriber-test-value';
    await apiCache.setSubscriberCache('test', testValue);
    const result = await apiCache.getSubscriberCache('test');
    expect(result).toBe(testValue);
  });

  // Test the transaction operations in ApiServiceCache
  test('ApiServiceCache - transaction operations', async () => {
    const testValue = 'transaction-test-value';
    await apiCache.setTransactionCache('test', testValue);
    const result = await apiCache.getTransactionCache('test');
    expect(result).toBe(testValue);
  });

  // Test additional RedisService methods: keyExists and getAllKeys using apiCache (db 0)
  test('RedisService: keyExists and getAllKeys', async () => {
    const key = 'keyExistsTest';
    const value = 'some-value';
    // Ensure the key is not present and then set it
    await apiCache.deleteKey(key);
    const setResult = await apiCache.setKey(key, value);
    expect(setResult).toBe(true);
    
    // Use RedisService methods directly
    const exists = await RedisService.keyExists(key);
    expect(exists).toBe(true);
    const keys = await RedisService.getAllKeys(key);
    expect(keys).toContain(key);
    
    const deleteResult = await apiCache.deleteKey(key);
    expect(deleteResult).toBe(true);
  });

  // Test that deleting a non-existing key returns false
  test('delete non-existing key returns false', async () => {
    const nonExistingKey = 'nonExistingKey';
    const result = await apiCache.deleteKey(nonExistingKey);
    expect(result).toBe(false);
  });

  // Test that keyExists returns false for a non-existing key
  test('RedisService: keyExists returns false for non-existing key', async () => {
    const key = 'nonExistingKey2';
    const exists = await RedisService.keyExists(key);
    expect(exists).toBe(false);
  });
});

afterAll(async () => {
  // Disconnect RedisService to close open connections.
  await RedisService.disconnect();
}); 