export default function makeCache(keyPrefix: string, ttlSec: number) {
  const store = new Map();
  const ttlMs = ttlSec * 1000;

  return {
    set(key: string, value: unknown) {
      store.set(`${keyPrefix}_${key}`, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    },

    get(key: string) {
      const { value, expiresAt } = store.get(`${keyPrefix}_${key}`) || {};

      if (expiresAt > Date.now()) return value;

      store.delete(`${keyPrefix}_${key}`);
      return undefined;
    },

    delete(key: string) {
      store.delete(`${keyPrefix}_${key}`);
    },

    clear() {
      store.clear();
    },
  };
}
