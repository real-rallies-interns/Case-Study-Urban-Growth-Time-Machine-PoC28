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
    infrastructure_index: Optional[float] = None
    capital_investment_m_usd: Optional[float] = None
    land_use_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class SchemeMetric(BaseModel):
    title: str
    description: str

class RegionMetric(BaseModel):
    name: str
    status: str
    metric: str
    severity: str

class ChangeDetectionResponse(BaseModel):
    aoi_id: str
    time_window: str
    metrics: List[GrowthMetric]
    geojson_url: str
    insight: str
    intelligence_score: float # 0.0 to 1.0
    trend_anomaly: str # Predictive context
    infrastructure_led: Optional[bool] = False
    capital_correlation_score: Optional[float] = None
    schemes: Optional[List[SchemeMetric]] = None
    regions: Optional[List[RegionMetric]] = None

class AOISave(AOIBase):
    user_id: str

class AOIDb(AOISave):
    id: str
    created_at: datetime
