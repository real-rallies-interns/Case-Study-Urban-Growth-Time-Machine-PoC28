# 🌍 Urban Growth Time Machine (PoC #28)

> **Spatiotemporal Intelligence for Modern Urbanism**

The **Urban Growth Time Machine** is a high-performance spatiotemporal intelligence system designed to detect, visualize, and analyze urban expansion patterns. By synthesizing multi-spectral satellite imagery and population density datasets, it provides a "time-lapse" view of global urbanization, enabling city planners to predict growth velocity and optimize infrastructure deployment.

---

## ✨ Key Features

- **🕒 Temporal Scrubbing**: Interactive timeline to visualize urban expansion from 1990 to present.
- **📊 Growth Velocity Analytics**: Real-time calculation of urbanization rates per Area of Interest (AOI).
- **🛰️ Multi-Layer Geospatial View**: Seamless integration of Satellite, Land Cover, and Population Heatmaps.
- **📉 Spatiotemporal Correlation**: Automated insights linking population shifts to physical land development.
- **🧠 Intelligence Engine**: Real-time "Intelligence Score" generation for urban stability and growth anomalies.
- **🛡️ Guardrail System**: Robust fallback logic to ensure continuous operation even during backend connectivity interruptions.
- **💎 Premium Dashboard**: Glassmorphic UI with high-fidelity Deck.gl visualizations.

---

## 🛠️ Tech Stack

### Backend
- **Core**: FastAPI (Python 3.10+)
- **Validation**: Pydantic v2
- **Processing**: GeoJSON & NumPy for spatial transformations
- **Mock Engine**: Internal `generator.py` for high-fidelity synthetic spatiotemporal data.

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS 4 + Lucide Icons
- **Mapping**: Mapbox GL JS & Deck.gl (High-performance large-scale visualization)
- **Charts**: Recharts & D3.js

---

## 🎨 Visual DNA

Following the **Real Rails Master Protocol**, the interface is optimized for high-impact visual storytelling:
- **Primary Background**: `#030712` (Deep Space Dark)
- **Glassmorphism**: 12% opacity overlays with `backdrop-blur-xl`.
- **Accents**: 
  - `Neon Cyan`: Infrastructure & Navigation
  - `Electric Blue`: Data Highlights
  - `Growth Green`: Urban Expansion Velocity
- **Layout**: 70/30 split (Immersive Map / Analytical Sidebar).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*Backend runs at [http://localhost:8000](http://localhost:8000)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at [http://localhost:3000](http://localhost:3000)*

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── api/          # API Route Handlers
│   │   ├── core/         # Configuration & Security
│   │   ├── mock/         # Spatiotemporal Data Generator
│   │   ├── schemas/      # Pydantic Models
│   │   └── services/     # Growth Analytics Logic
│   └── main.py           # Application Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/   # UI & Map Components
│   │   ├── lib/          # API Clients & Utilities
│   │   └── app/          # Next.js Pages & Layouts
│   └── public/           # Static Assets
└── README.md             # This file
```

---

## 👨‍💻 Developer
**Ananthu Anil**
Intern — Real Rails Protocol (Batch 2)

---

## 📜 License
Internal Internship Project - PoC #28.
