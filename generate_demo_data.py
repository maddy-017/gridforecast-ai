"""
GridForecast AI - Demo Data Generator
Creates realistic Karnataka solar/wind data + forecasts for dashboard demo
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

np.random.seed(42)

# ══════════════════════════════════════════════════════════════
# Karnataka Plant Definitions (Real Locations)
# ══════════════════════════════════════════════════════════════

plants = {
    'Pavagada Solar Park': {
        'type': 'solar',
        'capacity_mw': 200,
        'lat': 14.10,
        'lon': 77.28,
        'region': 'Tumkur',
        'commissioned': '2018-03-01'
    },
    'Raichur Solar': {
        'type': 'solar',
        'capacity_mw': 130,
        'lat': 16.20,
        'lon': 77.35,
        'region': 'Raichur',
        'commissioned': '2020-01-15'
    },
    'Bidar Solar': {
        'type': 'solar',
        'capacity_mw': 90,
        'lat': 17.92,
        'lon': 77.52,
        'region': 'Bidar',
        'commissioned': '2021-06-01'
    },
    'Chitradurga Wind Cluster': {
        'type': 'wind',
        'capacity_mw': 150,
        'lat': 14.23,
        'lon': 76.40,
        'region': 'Chitradurga',
        'commissioned': '2017-11-01'
    },
    'Gadag Wind Farm': {
        'type': 'wind',
        'capacity_mw': 200,
        'lat': 15.43,
        'lon': 75.63,
        'region': 'Gadag',
        'commissioned': '2019-08-01'
    },
    'Davangere Wind': {
        'type': 'wind',
        'capacity_mw': 120,
        'lat': 14.46,
        'lon': 75.92,
        'region': 'Davangere',
        'commissioned': '2018-05-01'
    }
}

# ══════════════════════════════════════════════════════════════
# Generate Historical Data (Past 7 Days)
# ══════════════════════════════════════════════════════════════

def generate_solar(capacity, hours):
    """Generate realistic solar generation pattern"""
    generation = []
    for hour in hours:
        h = hour.hour + hour.minute / 60
        day = hour.timetuple().tm_yday
        
        # Solar only during day (6 AM - 6 PM)
        if 6 <= h <= 18:
            # Bell curve peaking at noon
            angle_factor = np.cos(np.pi * (h - 12.5) / 12) ** 2
            
            # Seasonal (higher in Mar-May)
            seasonal = 0.85 + 0.15 * np.sin(2 * np.pi * (day - 80) / 365)
            
            # Random cloud cover (20-60%)
            cloud = 1 - np.random.beta(2, 3) * 0.5
            
            gen = capacity * 0.80 * angle_factor * seasonal * cloud
            gen *= (1 + np.random.normal(0, 0.03))
            generation.append(max(0, min(gen, capacity)))
        else:
            generation.append(0)
    
    return generation

def generate_wind(capacity, hours):
    """Generate realistic wind generation pattern"""
    generation = []
    base_speed = 7.0  # m/s
    
    for hour in hours:
        # Wind stronger in afternoon/evening
        hour_boost = 1.3 if 14 <= hour.hour <= 20 else 0.9
        
        # Seasonal (monsoon boost Jun-Sep)
        seasonal = 1.4 if 6 <= hour.month <= 9 else 0.85
        
        # Weibull distribution for wind
        wind_speed = base_speed * seasonal * hour_boost * np.random.weibull(2.0)
        wind_speed = max(0, min(wind_speed, 25))
        
        # Power curve
        if wind_speed < 3:  # cut-in
            gen = 0
        elif wind_speed >= 12:  # rated
            gen = capacity * 0.88
        else:
            gen = capacity * 0.88 * ((wind_speed - 3) / 9) ** 3
        
        gen *= (1 + np.random.normal(0, 0.05))
        generation.append(max(0, min(gen, capacity)))
    
    return generation

# ══════════════════════════════════════════════════════════════
# Generate Forecast (Next 24 Hours)
# ══════════════════════════════════════════════════════════════

def generate_forecast(plant_type, capacity, start_time):
    """Generate 24-hour forecast with uncertainty"""
    forecasts = []
    
    for i in range(24):
        hour_time = start_time + timedelta(hours=i)
        h = hour_time.hour
        
        if plant_type == 'solar':
            if 6 <= h <= 18:
                angle = np.cos(np.pi * (h - 12.5) / 12) ** 2
                base = capacity * 0.78 * angle
                uncertainty = 0.15 if 12 <= h <= 16 else 0.25  # more uncertain afternoon
            else:
                base = 0
                uncertainty = 0
        else:  # wind
            hour_boost = 1.2 if 14 <= h <= 20 else 0.9
            base = capacity * 0.70 * hour_boost * np.random.uniform(0.6, 1.0)
            uncertainty = 0.20
        
        # Add some noise
        forecast = base * (1 + np.random.normal(0, 0.05))
        
        # Calculate confidence intervals
        lower = max(0, forecast * (1 - uncertainty))
        upper = min(capacity, forecast * (1 + uncertainty))
        
        forecasts.append({
            'hour': i,
            'timestamp': hour_time.isoformat(),
            'forecast_mw': round(forecast, 2),
            'confidence_80_lower': round(lower, 2),
            'confidence_80_upper': round(upper, 2),
            'confidence_95_lower': round(max(0, forecast * (1 - uncertainty * 1.5)), 2),
            'confidence_95_upper': round(min(capacity, forecast * (1 + uncertainty * 1.5)), 2)
        })
    
    return forecasts

# ══════════════════════════════════════════════════════════════
# Main Generation
# ══════════════════════════════════════════════════════════════

print("=" * 70)
print("GridForecast AI — Generating Demo Data")
print("=" * 70)

# Create output directory
os.makedirs('demo_data', exist_ok=True)

# Historical period (past 7 days, hourly)
end_time = datetime(2024, 4, 24, 23, 0)
start_time = end_time - timedelta(days=7)
hours = pd.date_range(start=start_time, end=end_time, freq='h')

# Forecast period (next 24 hours from now)
forecast_start = datetime(2024, 4, 25, 0, 0)

all_historical = []
all_forecasts_data = {}
plant_metadata = []

for plant_name, info in plants.items():
    print(f"\n📍 {plant_name} ({info['type'].upper()}, {info['capacity_mw']} MW)")
    
    # Historical generation
    if info['type'] == 'solar':
        gen = generate_solar(info['capacity_mw'], hours)
    else:
        gen = generate_wind(info['capacity_mw'], hours)
    
    for hour, generation in zip(hours, gen):
        all_historical.append({
            'timestamp': hour.isoformat(),
            'plant_name': plant_name,
            'plant_type': info['type'],
            'capacity_mw': info['capacity_mw'],
            'generation_mw': round(generation, 2),
            'lat': info['lat'],
            'lon': info['lon'],
            'region': info['region']
        })
    
    # 24-hour forecast
    forecast_data = generate_forecast(info['type'], info['capacity_mw'], forecast_start)
    all_forecasts_data[plant_name] = forecast_data
    
    # Plant metadata for map
    plant_metadata.append({
        'name': plant_name,
        'type': info['type'],
        'capacity_mw': info['capacity_mw'],
        'lat': info['lat'],
        'lon': info['lon'],
        'region': info['region'],
        'current_output_mw': round(gen[-1], 2),  # last hour
        'today_forecast_avg': round(np.mean([f['forecast_mw'] for f in forecast_data[:12]]), 2)
    })
    
    print(f"  ✓ Historical: {len(gen)} hours")
    print(f"  ✓ Forecast: 24 hours")
    print(f"  ✓ Current output: {round(gen[-1], 1)} MW")

# ══════════════════════════════════════════════════════════════
# Save Files
# ══════════════════════════════════════════════════════════════

# 1. Historical data CSV
df_historical = pd.DataFrame(all_historical)
df_historical.to_csv('demo_data/historical_generation.csv', index=False)
print(f"\n✓ Saved: demo_data/historical_generation.csv ({len(df_historical)} rows)")

# 2. Forecast data JSON (easier for React to consume)
with open('demo_data/forecasts.json', 'w') as f:
    json.dump(all_forecasts_data, f, indent=2)
print(f"✓ Saved: demo_data/forecasts.json ({len(all_forecasts_data)} plants)")

# 3. Plant metadata JSON
with open('demo_data/plants.json', 'w') as f:
    json.dump(plant_metadata, f, indent=2)
print(f"✓ Saved: demo_data/plants.json ({len(plant_metadata)} plants)")

# 4. Summary stats
summary = {
    'total_capacity_mw': sum(p['capacity_mw'] for p in plant_metadata),
    'solar_capacity_mw': sum(p['capacity_mw'] for p in plant_metadata if p['type'] == 'solar'),
    'wind_capacity_mw': sum(p['capacity_mw'] for p in plant_metadata if p['type'] == 'wind'),
    'num_plants': len(plant_metadata),
    'forecast_period': '2024-04-25 00:00 to 2024-04-25 23:00',
    'generated_at': datetime.now().isoformat()
}

with open('demo_data/summary.json', 'w') as f:
    json.dump(summary, f, indent=2)
print(f"✓ Saved: demo_data/summary.json")

print("\n" + "=" * 70)
print("✅ All demo data generated successfully!")
print("=" * 70)
print("\nNext steps:")
print("1. Use forecasts.json and plants.json in your React dashboard")
print("2. historical_generation.csv shows past 7 days (for charts)")
print("3. summary.json has overall Karnataka stats")
print("\nReady to build the dashboard! 🚀")
