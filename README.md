# GridForecast AI ⚡

> AI-Powered Renewable Energy Generation Forecasting for Karnataka Grid Operators (KREDL / KSPDCL)

**AI for Bharat 2026 Hackathon — Theme 10: Renewable Generation Forecasting**  
**Team:** Abdulmoid Bangi & Farhan Shaikh  
**GitHub:** https://github.com/maddy-017/gridforecast-ai

---

## What is GridForecast AI?

GridForecast AI is a non-intrusive forecasting and decision-support layer that predicts solar and wind energy generation at plant and cluster level across Karnataka.

It delivers:
- **Day-ahead forecasts** — next 24 hours, hourly resolution
- **Intra-day updates** — refreshed as weather changes
- **Explicit uncertainty ranges** — 80% and 95% confidence intervals
- **Explainable predictions** — which factors (cloud cover, wind speed) drove each forecast
- **Plant + Cluster level** — individual plants and regional aggregation
- **Non-intrusive** — works alongside existing SCADA/EMS systems, no modification needed

---

## Project Structure

```
gridforecast-ai/
│
├── gridforecast-dashboard/          # React Frontend Dashboard
│   ├── public/
│   │   └── data/                    # Forecast data files
│   │       ├── plants.json
│   │       ├── forecasts.json
│   │       ├── summary.json
│   │       └── historical_generation.csv
│   ├── src/
│   │   ├── components/
│   │   │   ├── KarnatakaMap.js
│   │   │   ├── ForecastChart.js
│   │   │   ├── PlantCard.js
│   │   │   ├── SummaryStats.js
│   │   │   └── ExplanationPanel.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
├── generate_demo_data.py            # Generates synthetic Karnataka forecast data
├── requirements.txt                 # Python dependencies
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ → https://nodejs.org
- **Python** 3.9+ → https://python.org

Verify:
```bash
node --version
python3 --version
```

---

## Instructions to Run

### Step 1 — Clone the repo
```bash
git clone https://github.com/maddy-017/gridforecast-ai.git
cd gridforecast-ai
```

### Step 2 — Install Python dependencies
```bash
pip install -r requirements.txt
```

### Step 3 — Generate forecast data
```bash
python3 generate_demo_data.py
```

Creates `demo_data/` with:
- `plants.json`
- `forecasts.json`
- `summary.json`
- `historical_generation.csv`

### Step 4 — Copy data to dashboard
```bash
mkdir gridforecast-dashboard/public/data
cp demo_data/* gridforecast-dashboard/public/data/
```

Verify:
```bash
ls gridforecast-dashboard/public/data
```

Should show 4 files.

### Step 5 — Install dashboard dependencies
```bash
cd gridforecast-dashboard
npm install
```

### Step 6 — Start the dashboard
```bash
npm start
```

### Step 7 — Open browser
```
http://localhost:3000
```

---

## What You Will See

**Summary Stats Bar**
- Total capacity: 890 MW (420 MW solar + 470 MW wind)
- Current output, tomorrow's forecast average, active plants

**Karnataka Map**
- 6 plant markers (yellow = solar, blue = wind)
- Click any plant to view its 24-hour forecast

**24-Hour Forecast Chart**
- Blue line = point forecast (MW)
- Light shaded band = 80% confidence interval
- Wider band = 95% confidence interval

**6 Plant Cards**
- Pavagada Solar Park — 200 MW — Tumkur
- Raichur Solar — 130 MW — Raichur
- Bidar Solar — 90 MW — Bidar
- Chitradurga Wind Cluster — 150 MW — Chitradurga
- Gadag Wind Farm — 200 MW — Gadag
- Davangere Wind — 120 MW — Davangere

**How This Forecast Works Panel**
- TFT + LightGBM model explanation
- Conformal Prediction uncertainty
- TreeSHAP + GradientSHAP explainability
- Deployment architecture

---

## Technical Approach

### Models
| Model | Role |
|-------|------|
| Temporal Fusion Transformer (TFT) | Primary — multi-horizon, attention-based |
| LightGBM | Validation + ensemble component |

### Uncertainty
- **Conformal Prediction (MAPIE)** — guaranteed P(y ∈ C(x)) ≥ 1 - α
- 80% CI for operational planning
- 95% CI for worst-case scenarios

### Explainability
- **TreeSHAP** for LightGBM — exact polynomial-time Shapley values
- **GradientSHAP** for TFT — Integrated Gradients for Transformer layers

### Data Sources
| Source | Data |
|--------|------|
| PVGIS (EU JRC) | Solar irradiance — training data |
| ERA5 (ECMWF) | Wind, temperature, cloud cover |
| POSOCO | Regional generation — validation |
| IMD | Weather forecasts — intra-day updates |

### Non-Negotiables
| Constraint | How Addressed |
|-----------|---------------|
| No system modification | Read-only plug-in layer |
| No real data | Synthetic Karnataka plant profiles |
| No hosted LLMs | Local PyTorch + LightGBM only |
| Explainable | TreeSHAP + GradientSHAP |
| Uncertainty | Conformal Prediction |
| Generalizable | One model — solar + wind + all regions |

---

## Troubleshooting

**`npm: command not found`** → Install Node.js from https://nodejs.org

**`python3: command not found`** → Install Python from https://python.org

**Dashboard blank page** → Make sure 4 data files exist in `public/data/`

**Port 3000 in use** → Press `Y` when React asks to use port 3001

---

## Team

| Name | Role | Contact |
|------|------|---------|
| Abdulmoid Bangi | Lead, ML Architecture | bangiabdulmoid@gmail.com |
| Farhan Shaikh | Frontend Dashboard | farhanshaikh121212mm@gmail.com |

---

*AI for Bharat 2026 — PAN IIT Bangalore Alumni Association & Government of Karnataka*
