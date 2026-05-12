import sys
import os

# Add the backend app directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from app.services.data_service import DataService

def test_data_service():
    print("Testing DataService...")
    aoi_id = "REG-001"
    data = DataService.get_metrics_by_aoi(aoi_id)
    
    if data:
        print(f"✅ Successfully retrieved data for {aoi_id}")
        print(f"Region: {data['insight']}")
        print(f"Metrics count: {len(data['metrics'])}")
        print(f"Time window: {data['time_window']}")
    else:
        print(f"❌ Failed to retrieve data for {aoi_id}")

    # Test invalid AOI
    invalid_aoi = "REG-999"
    data = DataService.get_metrics_by_aoi(invalid_aoi)
    if data is None:
        print(f"✅ Correctly handled invalid AOI: {invalid_aoi}")
    else:
        print(f"❌ Should have returned None for invalid AOI: {invalid_aoi}")

if __name__ == "__main__":
    test_data_service()
