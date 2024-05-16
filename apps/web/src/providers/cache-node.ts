import NodeCache from 'node-cache';

import { ICache } from './cache';
import { GasPrice } from "./gas-price-provider";

export class NodeJSCache<T> implements ICache<T> {
  constructor(private nodeCache: NodeCache) {}

  async get(key: string): Promise<T | undefined> {
    return this.nodeCache.get<T>(key);
  }

  async batchGet(keys: Set<string>): Promise<Record<string, T | undefined>> {
    const keysArr = Array.from(keys);
    const values = await Promise.all(keysArr.map((key) => this.get(key)));

    const result: Record<string, T | undefined> = {};

    keysArr.forEach((key, index) => {
      result[key] = values[index];
    });

    return result;
  }

  async set(key: string, value: T, ttl?: number): Promise<boolean> {
    if (ttl) {
      return this.nodeCache.set(key, value, ttl);
    } else {
      return this.nodeCache.set(key, value);
    }
  }

  async has(key: string): Promise<boolean> {
    return this.nodeCache.has(key);
  }
}

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
