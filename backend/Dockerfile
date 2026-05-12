# SECTION 1: BASE IMAGE (Python 3.10 Slim for minimal footprint)
FROM python:3.10-slim as base

# Set working directory
WORKDIR /app

# Install system dependencies for geospatial libraries (geopandas, rasterio, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgdal-dev \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for GDAL
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./backend .

# Copy intelligence data
COPY ./urban-growth-mock-data/export/synthetic_growth_data.json ./data/synthetic_growth_data.json

# Expose backend port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
