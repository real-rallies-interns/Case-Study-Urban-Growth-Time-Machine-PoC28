// Hardcode for local dev to ensure we hit the right backend
const API_BASE_URL = 'http://localhost:8001/api/v1';

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
