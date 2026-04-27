# Urban Growth Time Machine - Backend

## Overview
FastAPI backend for the PoC #28. Detects urban growth velocity using satellite imagery and population data.

## Protocol Adherence
- **Step 1**: Backend first implementation.
- **Mock Fallback**: Integrated `generator.py` for v1/offline development.
- **Output**: Structured JSON/GeoJSON for spatiotemporal insights.

## Setup
1. Create virtual env: `python -m venv venv`
2. Activate: `source venv/bin/activate`
3. Install: `pip install -r requirements.txt`
4. Run: `uvicorn app.main:app --reload`

## API Endpoints
- `GET /api/v1/growth/{aoi_id}`: Returns growth metrics and insights.
- `GET /api/v1/health`: System status.
