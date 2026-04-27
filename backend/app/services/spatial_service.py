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
        
        if total_diff > 10:
            return f"Critical expansion detected: Built-up area increased by {total_diff:.2f}sqkm. Infrastructure demand is peaking in the western corridors."
        return "Stable growth observed. Urban density is consolidating within existing boundaries."
