import { API_URL } from './api';
import { getValidCachedEquipment, setEquipmentCache, type Equipment } from './equipmentCache';

let inFlightRequest: Promise<Equipment[]> | null = null;

async function fetchEquipmentFromApi(): Promise<Equipment[]> {
  const controller = new AbortController();
  const timeoutMs = 8000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_URL}/api/equipment`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Unable to load equipment');
    }

    const data = await response.json();
    const normalized = Array.isArray(data) ? data as Equipment[] : [];
    setEquipmentCache(normalized);
    return normalized;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Catalog request timed out. Showing cached equipment.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function fetchEquipment(): Promise<Equipment[]> {
  const cached = getValidCachedEquipment();

  if (cached) {
    if (!inFlightRequest) {
      inFlightRequest = fetchEquipmentFromApi().catch((error) => {
        throw error;
      }).finally(() => {
        inFlightRequest = null;
      });

      void inFlightRequest.catch(() => undefined);
    }

    return cached;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetchEquipmentFromApi().finally(() => {
    inFlightRequest = null;
  });

  return inFlightRequest;
}

export async function prefetchEquipment(): Promise<Equipment[]> {
  try {
    return await fetchEquipment();
  } catch {
    return getValidCachedEquipment() ?? [];
  }
}
