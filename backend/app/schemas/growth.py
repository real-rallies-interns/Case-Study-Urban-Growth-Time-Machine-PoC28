from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AOIBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    zoom: float

class AOI(AOIBase):
    id: str
    created_at: datetime

class GrowthMetric(BaseModel):
    year: int
    built_up_area_sqkm: float
    population_density: float
    growth_velocity_pct: Optional[float] = None

class ChangeDetectionResponse(BaseModel):
    aoi_id: str
    time_window: str
    metrics: List[GrowthMetric]
    geojson_url: str
    insight: str
    intelligence_score: float # 0.0 to 1.0
    trend_anomaly: str # Predictive context (e.g., "ACCELERATING", "STABLE", "DECOUPLING")

class AOISave(AOIBase):
    user_id: str

class AOIDb(AOISave):
    id: str
    created_at: datetime
