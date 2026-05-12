# 🧪 Urban Growth Mock Data Package

This package provides high-fidelity synthetic data for the **Urban Growth Time Machine** PoC. It is designed to test the frontend's spatiotemporal visualizations and the backend's analytics engine without requiring live satellite feeds.

## 📁 Package Structure

- `generator.py`: The core generation script.
- `data_dictionary.md`: Detailed field definitions and types.
- `export/`: Contains the latest generated datasets.
  - `synthetic_growth_data.json`
  - `synthetic_growth_data.csv`

## 🏷️ Synthetic Labeling

**IMPORTANT**: Every record in this dataset contains an `is_synthetic: true` field. This is a mandatory guardrail to ensure that demonstration data is never mistaken for real-world geospatial intelligence.

## 🚀 How to Generate

To refresh the synthetic data:

```bash
python3 generator.py
```

## ⚠️ Edge Cases Included

The generator automatically injects the following scenarios to test system robustness:

1. **EXTREME_GROWTH**: Growth velocity spikes (>100%) to validate anomaly detection alerts.
2. **NEGATIVE_GROWTH**: Abandonment scenarios where built-up area decreases.
3. **MISSING_DATA**: Null values in metrics to test UI fallback states.
4. **INVALID_COORDS**: Out-of-bounds geographic markers for boundary testing.
