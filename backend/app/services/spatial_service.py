import geopandas as gpd
from shapely.geometry import Point, box
from typing import List, Dict
import numpy as np

class SpatialIntelligenceService:
    @staticmethod
    def calculate_urban_growth(lat: float, lon: float, buffer_km: float = 5.0) -> Dict:
        """
        Simulates the logic of detecting urban growth within a buffer zone.
        In a production environment, this would query Sentinel-2 imagery.
        """
        # Create a bounding box for the AOI
        # 1 degree is roughly 111km
        delta = buffer_km / 111.0
        aoi_polygon = box(lon - delta, lat - delta, lon + delta, lat + delta)
        
        # Simulate building footprint detection
        # Logic: Growth velocity is higher in outskirts than city center
        total_area = aoi_polygon.area
        
        # Placeholder for real image processing (Natural -> Urban transition)
        # We simulate this by generating growth percentages based on location
        growth_rate = np.random.uniform(5.0, 18.0) 
        
        return {
            "aoi_area_sqkm": round(buffer_km ** 2, 2),
            "detected_growth_velocity": round(growth_rate, 2),
            "land_use_split": {
                "urban": round(growth_rate + 20, 2),
                "natural": round(80 - growth_rate, 2)
            }
        }

    @staticmethod
    def generate_growth_insights(metrics: List[Dict]) -> str:
        """
        Intelligence Layer: Converts raw numbers into actionable text.
        """
        if not metrics:
            return "Insufficient data for trend analysis."
            
        recent = metrics[-1]
        baseline = metrics[0]
        
        total_diff = round(recent['built_up_area_sqkm'] - baseline['built_up_area_sqkm'], 2)
        infra = recent.get('infrastructure_index', 0)
        investment = recent.get('capital_investment_m_usd', 0)
        
        if infra > 0.8 and total_diff < 10:
            return f"INFRA_LEAD detected. High infrastructure density ({infra}) with low population expansion. This suggests a planned 'Engineered Growth' scenario or early land visibility for capital actors."
        
        if investment > 1000 and total_diff > 20:
            return f"CAPITAL_SURGE detected. Expansion is highly correlated with FDI/Investment ($ {investment}M). Urban growth is being steered by institutional real estate play."

        if total_diff > 15:
            return f"Organic expansion detected: Built-up area increased by {total_diff:.2f}sqkm. Population density is trailing physical development."
        
        return "Stable urban consolidation. Growth is organic and matches historical population shifts."
