import { ICache } from "./cache";
import { GasPrice } from "./gas-price-provider";

export class GasPriceCache implements ICache<GasPrice> {
  private cache: Map<string, GasPrice>;
  private ttl: number;

  constructor(ttl: number) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  async get(key: string): Promise<GasPrice | undefined> {
    return this.cache.get(key);
  }

  async batchGet(
    keys: Set<string>,
  ): Promise<Record<string, GasPrice | undefined>> {
    const result: Record<string, GasPrice | undefined> = {};
    for (const key of keys) {
      result[key] = this.cache.get(key);
    }
    return result;
  }

  async set(key: string, value: GasPrice, ttl?: number): Promise<boolean> {
    this.cache.set(key, value);
    setTimeout(
      () => {
        this.cache.delete(key);
      },
      (ttl || this.ttl) * 1000,
    );
    return true;
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }
}
