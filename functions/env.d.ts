/// <reference types="@cloudflare/workers-types" />

declare const caches: CacheStorage & {
  default: Cache;
};
