// Interfaces for Growth Intelligence
export interface GrowthMetric {
  year: number;
  built_up_area_sqkm: number;
  population_density: number;
  growth_velocity_pct?: number;
  infrastructure_index?: number;
  capital_investment_m_usd?: number;
  land_use_type?: string;
  latitude?: number;
  longitude?: number;
}

export interface ChangeDetectionResponse {
  aoi_id: string;
  time_window: string;
  metrics: GrowthMetric[];
  geojson_url: string;
  insight: string;
  intelligence_score: number;
  trend_anomaly: string;
  infrastructure_led?: boolean;
  capital_correlation_score?: number;
  schemes?: Array<{ title: string; description: string }>;
  regions?: Array<{ name: string; status: string; metric: string; severity: string }>;
}

export interface AOISave {
  name: string;
  latitude: number;
  longitude: number;
  zoom: number;
  user_id: string;
}

export interface AOIDb extends AOISave {
  id: string;
  created_at: string;
}

// Point directly to the backend in Azure to ensure connectivity
const API_BASE_URL = 'https://poc-urbangyowthbackend.ashybush-4248957c.centralindia.azurecontainerapps.io/api/v1';

export async function fetchGrowthMetrics(aoiId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/growth/${aoiId}`);
    if (!response.ok) throw new Error('API_UNAVAILABLE');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { aoi_id: "error", metrics: [] };
  }
}

export async function fetchAllGrowthMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/growth`);
    if (!response.ok) throw new Error('API_UNAVAILABLE');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function saveAOI(aoiData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/aoi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aoiData)
    });
    return await response.json();
  } catch (error) {
    // Fallback to LocalStorage for AOI Save
    const existing = JSON.parse(localStorage.getItem('saved_aois') || '[]');
    const newAoi = { ...aoiData, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
    localStorage.setItem('saved_aois', JSON.stringify([...existing, newAoi]));
    return newAoi;
  }
}
