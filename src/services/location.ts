import { appConfig } from "@/config";

export interface LgdState {
  code: string;
  name: string;
  name_local?: string;
  type?: string;
}

export interface LgdDistrict {
  code: string;
  name: string;
  state_code: string;
}

interface LgdResponse<T> {
  success: boolean;
  data: T[];
}

/**
 * Fetch all 36 Indian states and union territories from the India LGD Index API.
 */
export async function fetchStates(): Promise<LgdState[]> {
  try {
    const baseUrl = appConfig.indiaLgdApiUrl.replace(/\/+$/, "");
    const res = await fetch(`${baseUrl}/v1/states`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch states: HTTP ${res.status}`);
    }
    const json: LgdResponse<LgdState> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching states from India LGD API:", error);
    return [];
  }
}

/**
 * Fetch districts for a given state code (or all districts if none specified).
 */
export async function fetchDistricts(
  stateCode?: string,
): Promise<LgdDistrict[]> {
  try {
    const baseUrl = appConfig.indiaLgdApiUrl.replace(/\/+$/, "");
    const url = stateCode
      ? `${baseUrl}/v1/districts?state=${encodeURIComponent(stateCode)}`
      : `${baseUrl}/v1/districts`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch districts: HTTP ${res.status}`);
    }
    const json: LgdResponse<LgdDistrict> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching districts from India LGD API:", error);
    return [];
  }
}
