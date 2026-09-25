export interface Equipment {
  _id: string;
  name: string;
  sport: string;
  pricePerHour: number;
  image: string;
  stock: number;
  status: string;
  depositAmount: number;
  lockerId?: string;
}

const CACHE_KEY = 'turfgear_equipment_cache';
const CACHE_TTL_MS = 5 * 60 * 1000;

let memoryCache: Equipment[] | null = null;

function safeStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getValidCachedEquipment(): Equipment[] | null {
  if (memoryCache) {
    return memoryCache;
  }

  const storage = safeStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { data?: Equipment[]; timestamp?: number } | null;
    if (!parsed || !Array.isArray(parsed.data)) {
      storage.removeItem(CACHE_KEY);
      return null;
    }

    const isExpired = typeof parsed.timestamp === 'number'
      ? Date.now() - parsed.timestamp > CACHE_TTL_MS
      : true;

    if (isExpired) {
      storage.removeItem(CACHE_KEY);
      return null;
    }

    memoryCache = parsed.data;
    return parsed.data;
  } catch {
    storage.removeItem(CACHE_KEY);
    return null;
  }
}

export function setEquipmentCache(data: Equipment[]) {
  memoryCache = data;
  const storage = safeStorage();

  if (!storage) {
    return data;
  }

  try {
    storage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Ignore storage quota issues and keep in-memory cache only.
  }

  return data;
}

export function clearEquipmentCache() {
  memoryCache = null;
  const storage = safeStorage();
  if (storage) {
    storage.removeItem(CACHE_KEY);
  }
}
