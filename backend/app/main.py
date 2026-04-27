from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.growth import ChangeDetectionResponse, AOISave, AOIDb
from app.mock.generator import generate_mock_growth_data
from app.services.spatial_service import SpatialIntelligenceService
import os
import uuid
from datetime import datetime
from typing import List

app = FastAPI(title="Urban Growth Time Machine API")

# Mock Database for AOIs
aoi_db = {}

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "message": "Urban Growth Time Machine Backend Active"}

@app.get("/api/v1/growth/{aoi_id}", response_model=ChangeDetectionResponse)
async def get_growth_metrics(aoi_id: str):
    """
    SECTION 2: INTELLIGENCE LAYER (MANDATORY)
    Transforms raw outputs into predictive insights.
    """
    try:
        data = generate_mock_growth_data(aoi_id)
        
        # Intelligence Score & Trend Anomaly
        latest = data['metrics'][-1]
        baseline = data['metrics'][0]
        
        growth_vel = latest['growth_velocity_pct']
        pop_density_delta = latest['population_density'] - baseline['population_density']
        
        # Predictive Trend Logic
        if growth_vel > 20 and pop_density_delta < 500:
            trend_anomaly = "DECOUPLING" # Area growing but population lagging
        elif growth_vel > 15:
            trend_anomaly = "ACCELERATING"
        else:
            trend_anomaly = "STABLE"

        intelligence_score = min(1.0, max(0.0, (growth_vel / 5.0) / 5.0))

        return {
            **data,
            "insight": dynamic_insight,
            "intelligence_score": round(intelligence_score, 2),
            "trend_anomaly": trend_anomaly
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/aoi", response_model=AOIDb)
async def save_aoi(aoi: AOISave):
    """
    SECTION 3: AOI SAVE FEATURE
    """
    aoi_id = str(uuid.uuid4())
    new_aoi = AOIDb(
        **aoi.dict(),
        id=aoi_id,
        created_at=datetime.now()
    )
    aoi_db[aoi_id] = new_aoi
    return new_aoi

@app.get("/api/v1/aoi", response_model=List[AOIDb])
async def list_aois():
    return list(aoi_db.values())

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
