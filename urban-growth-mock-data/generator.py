import json
import csv
import random
import os
from datetime import datetime

# Configuration
OUTPUT_DIR = "urban-growth-mock-data/export"
SAMPLE_ROWS = 150 # Increased sample size
PROJECT_TITLE = "Urban Growth Time Machine"

def generate_synthetic_data():
    """Generates a hyper-dense local network of urban growth nodes within Bengaluru, India."""
    
    # Bengaluru Sectors
    regions = [
        {"id": "BNG-CEN", "name": "Bengaluru Central", "lat": 12.9716, "lon": 77.5946},
        {"id": "BNG-NOR", "name": "Bengaluru North (Hebbal)", "lat": 13.0358, "lon": 77.5970},
        {"id": "BNG-SOU", "name": "Bengaluru South (JP Nagar)", "lat": 12.9063, "lon": 77.5857},
        {"id": "BNG-EAS", "name": "Bengaluru East (Whitefield)", "lat": 12.9698, "lon": 77.7500},
        {"id": "BNG-WES", "name": "Bengaluru West (Kengeri)", "lat": 12.9176, "lon": 77.4833}
    ]

    metrics_data = []
    years = list(range(2000, 2024))
    
    # Generate 15 sub-nodes per sector for a total of 75 local nodes
    for region in regions:
        for node_idx in range(15):
            node_id = f"{region['id']}-NODE-{node_idx+1:02d}"
            
            # Tighter radius for local district visualization
            node_lat = region["lat"] + random.uniform(-0.04, 0.04)
            node_lon = region["lon"] + random.uniform(-0.04, 0.04)
            
            base_area = random.uniform(2.0, 15.0)
            base_pop = random.uniform(500, 20000)
            base_infra = random.uniform(0.1, 0.5)
            base_investment = random.uniform(5.0, 50.0)
            
            prev_area = None
            
            for year in years:
                rate = random.uniform(0.01, 0.08)
                if random.random() > 0.9: rate *= 3.0 # Occasional surge
                
                current_area = base_area * (1 + rate)**(year - 2000)
                current_pop = base_pop * (1 + (rate * 1.2))**(year - 2000)
                infra_index = min(1.0, base_infra + (rate * 0.7 * (year - 2000)))
                investment = base_investment * (1 + rate * 1.1)**(year - 2000)
                
                velocity = ((current_area - prev_area) / prev_area * 100) if prev_area else 0.0
                density = current_pop / current_area
                
                # Balanced classification for Bengaluru's urban sprawl
                if density > 4000: land_use = "URBAN"
                elif density > 2000: land_use = "SUBURBAN"
                elif density > 1000: land_use = "COMMERCIAL"
                elif density > 400: land_use = "RESIDENTIAL"
                else: land_use = "RURAL"
                
                if node_idx % 5 == 0: land_use = "INDUSTRIAL"

                metrics_data.append({
                    "aoi_id": node_id,
                    "region_name": f"{region['name']} Zone {node_idx+1}",
                    "year": year,
                    "latitude": node_lat + random.uniform(-0.001, 0.001),
                    "longitude": node_lon + random.uniform(-0.001, 0.001),
                    "built_up_area_sqkm": round(current_area, 2),
                    "population_density": round(density, 2),
                    "growth_velocity_pct": round(velocity, 2),
                    "infrastructure_index": round(infra_index, 2),
                    "capital_investment_m_usd": round(investment, 2),
                    "land_use_type": land_use,
                    "confidence_score": round(random.uniform(0.9, 0.99), 2),
                    "is_synthetic": True,
                    "scenario": "LOCAL_DENSE"
                })
                prev_area = current_area

    # Export to JSON
    json_path = os.path.join(OUTPUT_DIR, "synthetic_growth_data.json")
    with open(json_path, 'w') as f:
        json.dump({
            "title": PROJECT_TITLE,
            "generated_at": datetime.now().isoformat(),
            "records_count": len(metrics_data),
            "data": metrics_data
        }, f, indent=4)
    json_path = os.path.join(OUTPUT_DIR, "synthetic_growth_data.json")
    with open(json_path, 'w') as f:
        json.dump({
            "title": PROJECT_TITLE,
            "generated_at": datetime.now().isoformat(),
            "records_count": len(metrics_data),
            "data": metrics_data
        }, f, indent=4)

    # Export to CSV
    csv_path = os.path.join(OUTPUT_DIR, "synthetic_growth_data.csv")
    if metrics_data:
        keys = metrics_data[0].keys()
        with open(csv_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(metrics_data)

    print(f"✅ Generated {len(metrics_data)} rows of synthetic data with enhanced infrastructure and capital metrics.")
    print(f"📁 JSON: {json_path}")
    print(f"📁 CSV: {csv_path}")

if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    generate_synthetic_data()
