import json
import random
from datetime import datetime
from typing import List

def generate_mock_growth_data(aoi_id: str) -> dict:
    years = [2018, 2019, 2020, 2021, 2022, 2023]
    base_area = 50.0
    base_pop = 1200.0
    
    metrics = []
    prev_area = None
    
    for year in years:
        growth = random.uniform(2.0, 8.0)
        current_area = base_area + (growth * (year - 2018))
        current_pop = base_pop + (random.uniform(50, 200) * (year - 2018))
        
        velocity = None
        if prev_area:
            velocity = ((current_area - prev_area) / prev_area) * 100
        
        metrics.append({
            "year": year,
            "built_up_area_sqkm": round(current_area, 2),
            "population_density": round(current_pop, 2),
            "growth_velocity_pct": round(velocity, 2) if velocity else 0.0
        })
        prev_area = current_area
        
    return {
        "aoi_id": aoi_id,
        "time_window": "2018-2023",
        "metrics": metrics,
        "geojson_url": "/mock/growth_boundary.json",
        "insight": "Residential expansion moving west; 15% increase in built-up area detected since 2018.",
        "schemes": [
            {
                "title": "Why This Matters (Infra Insight)",
                "description": "Urban expansion is currently decoupled from utility density. Predictive modeling suggest a 14-month window before infrastructure failure in the West Corridor."
            },
            {
                "title": "Who Controls the Rail",
                "description": "Governance sits with the ESA Spatial Authority and the Regional Planning Bureau. All decisions are subject to spectral verification."
            }
        ],
        "regions": [
            {
                "name": "BANGALORE_WEST_CORRIDOR",
                "status": "URGENT_UPGRADE_REQUIRED",
                "metric": "+31%",
                "severity": "high"
            },
            {
                "name": "CENTRAL_TRANSIT_HUB",
                "status": "MONITORING_ACTIVE",
                "metric": "+12%",
                "severity": "low"
            }
        ]
    }

def save_mock_data():
    data = generate_mock_growth_data("mock_city_001")
    with open("/Users/ananthuanil/Internship/2nd project/2ndprject/backend/app/mock/mock_data.json", "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    save_mock_data()
