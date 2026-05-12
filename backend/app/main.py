from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.growth import ChangeDetectionResponse, AOISave, AOIDb
from app.services.data_service import DataService
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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "message": "Urban Growth Time Machine Backend Active"}

@app.get("/api/v1/growth")
async def get_all_growth_metrics():
    """
    Returns metrics for all available regions.
    """
    try:
        all_data = DataService.load_synthetic_data()
        metrics = all_data.get("data", [])
        print(f"📊 Serving {len(metrics)} growth metrics")
        return metrics
    except Exception as e:
        print(f"❌ Error in get_all_growth_metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/growth/{aoi_id}", response_model=ChangeDetectionResponse)
async def get_growth_metrics(aoi_id: str):
    """
    SECTION 2: INTELLIGENCE LAYER (MANDATORY)
    Transforms raw outputs (now from file) into predictive insights.
    """
    try:
        data = DataService.get_metrics_by_aoi(aoi_id)
        
        if not data:
            raise HTTPException(status_code=404, detail=f"AOI {aoi_id} not found in dataset")

        # Intelligence Score & Trend Anomaly
        latest = data['metrics'][-1]
        baseline = data['metrics'][0]
        
        growth_vel = latest['growth_velocity_pct']
        pop_density_delta = latest['population_density'] - baseline['population_density']
        infra_index = latest.get('infrastructure_index', 0)
        investment = latest.get('capital_investment_m_usd', 0)
        
        # Predictive Trend Logic (Enhanced)
        if growth_vel > 20 and pop_density_delta < 500:
            trend_anomaly = "DECOUPLING" 
        elif infra_index > 0.8 and pop_density_delta < 1000:
            trend_anomaly = "INFRA_LED_EXPANSION" # Infrastructure leads population
        elif growth_vel > 15:
            trend_anomaly = "ACCELERATING"
        elif growth_vel < 0:
            trend_anomaly = "DECLINING"
        else:
            trend_anomaly = "STABLE"

        # Correlation Score (Capital vs Growth)
        # Simplified: Higher investment per built-up area growth = higher correlation
        capital_correlation = min(1.0, investment / (growth_vel + 0.1) / 100) if growth_vel > 0 else 0

        intelligence_score = min(1.0, max(0.0, (abs(growth_vel) / 5.0) / 5.0))

        dynamic_insight = SpatialIntelligenceService.generate_growth_insights(data['metrics'])

        return {
            **data,
            "insight": dynamic_insight,
            "intelligence_score": round(intelligence_score, 2),
            "trend_anomaly": trend_anomaly,
            "infrastructure_led": trend_anomaly == "INFRA_LED_EXPANSION",
            "capital_correlation_score": round(capital_correlation, 2)
        }
    except HTTPException:
        raise
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
    # Diagnostic info
    path = os.getenv("GROWTH_DATA_PATH", "NOT_SET")
    exists = os.path.exists(path) if path != "NOT_SET" else False
    fallback_path = "/app/data/synthetic_growth_data.json"
    fallback_exists = os.path.exists(fallback_path)
    
    # Check data content
    records_count = 0
    if fallback_exists:
        try:
            data = DataService.load_synthetic_data()
            records_count = len(data.get("data", []))
        except:
            records_count = -1 # Error reading
            
    return {
        "status": "healthy",
        "env_path": path,
        "env_path_exists": exists,
        "fallback_path": fallback_path,
        "fallback_exists": fallback_exists,
        "records_found": records_count,
        "cwd": os.getcwd()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
