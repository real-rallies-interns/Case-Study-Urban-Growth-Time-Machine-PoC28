import json
import os
from typing import List, Dict, Optional

class DataService:
    # Use environment variable for portability (Docker/Cloud)
    DATA_PATH = os.getenv("GROWTH_DATA_PATH", "/app/data/synthetic_growth_data.json")

    @staticmethod
    def load_synthetic_data() -> Dict:
        """Loads the synthetic dataset from the exported JSON file."""
        if not os.path.exists(DataService.DATA_PATH):
            print(f"⚠️ Warning: Synthetic data file not found at {DataService.DATA_PATH}")
            return {"data": []}
        
        try:
            with open(DataService.DATA_PATH, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Error loading synthetic data: {e}")
            return {"data": []}

    @staticmethod
    def get_metrics_by_aoi(aoi_id: str) -> Optional[Dict]:
        """Retrieves and formats metrics for a specific AOI from the dataset."""
        all_data = DataService.load_synthetic_data()
        records = all_data.get("data", [])
        
        # Filter records for the specific AOI
        aoi_records = [r for r in records if r.get("aoi_id") == aoi_id]
        
        if not aoi_records:
            return None
        
        # Sort by year to ensure correct chronological order
        aoi_records.sort(key=lambda x: x["year"])
        
        # Map to the format expected by the frontend (matching ChangeDetectionResponse)
        metrics = []
        for r in aoi_records:
            metrics.append({
                "year": r["year"],
                "built_up_area_sqkm": r["built_up_area_sqkm"],
                "population_density": r["population_density"],
                "growth_velocity_pct": r["growth_velocity_pct"],
                "infrastructure_index": r.get("infrastructure_index"),
                "capital_investment_m_usd": r.get("capital_investment_m_usd"),
                "land_use_type": r.get("land_use_type"),
                "latitude": r.get("latitude"),
                "longitude": r.get("longitude")
            })

        return {
            "aoi_id": aoi_id,
            "time_window": f"{aoi_records[0]['year']}-{aoi_records[-1]['year']}",
            "metrics": metrics,
            "geojson_url": "/mock/growth_boundary.json",
            "insight": f"Spatiotemporal analysis for {aoi_records[0].get('region_name', 'Unknown Region')}",
            "intelligence_score": 0.0,
            "trend_anomaly": "UNKNOWN",
            "infrastructure_led": False,
            "capital_correlation_score": 0.0
        }
