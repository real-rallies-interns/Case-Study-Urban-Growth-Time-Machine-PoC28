const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchGrowthMetrics(aoiId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/growth/${aoiId}`);
    if (!response.ok) throw new Error('API_UNAVAILABLE');
    return await response.json();
  } catch (error) {
    // SECTION 5: MOCK FALLBACK SYSTEM
    console.warn('Real Rails Protocol: Falling back to local mock_data.json');
    try {
        const fallback = await fetch('/mock_data.json');
        return await fallback.json();
    } catch (innerError) {
        return {
            aoi_id: "critical_fallback",
            time_window: "ERROR",
            metrics: [],
            geojson_url: "",
            insight: "SYSTEM_FAILURE: No data available.",
            intelligence_score: 0
        };
    }
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
