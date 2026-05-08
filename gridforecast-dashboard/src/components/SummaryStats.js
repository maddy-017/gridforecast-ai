import React from 'react';

function SummaryStats({ summary, plants }) {
  // Calculate current total output
  const currentOutput = plants.reduce((sum, plant) => sum + plant.current_output_mw, 0);
  
  // Calculate tomorrow's forecast average
  const forecastAvg = plants.reduce((sum, plant) => sum + plant.today_forecast_avg, 0);
  
  return (
    <div className="summary-stats">
      <div className="stats-grid">
        <div className="stat-item">
          <h3>Total Capacity</h3>
          <div className="stat-value">
            {summary.total_capacity_mw}
            <span className="stat-unit">MW</span>
          </div>
        </div>
        
        <div className="stat-item">
          <h3>Solar Capacity</h3>
          <div className="stat-value">
            {summary.solar_capacity_mw}
            <span className="stat-unit">MW</span>
          </div>
        </div>
        
        <div className="stat-item">
          <h3>Wind Capacity</h3>
          <div className="stat-value">
            {summary.wind_capacity_mw}
            <span className="stat-unit">MW</span>
          </div>
        </div>
        
        <div className="stat-item">
          <h3>Current Output</h3>
          <div className="stat-value">
            {currentOutput.toFixed(1)}
            <span className="stat-unit">MW</span>
          </div>
        </div>
        
        <div className="stat-item">
          <h3>Tomorrow Forecast Avg</h3>
          <div className="stat-value">
            {forecastAvg.toFixed(1)}
            <span className="stat-unit">MW</span>
          </div>
        </div>
        
        <div className="stat-item">
          <h3>Active Plants</h3>
          <div className="stat-value">
            {summary.num_plants}
            <span className="stat-unit">plants</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryStats;
