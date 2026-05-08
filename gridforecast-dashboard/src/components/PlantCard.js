import React from 'react';

function PlantCard({ plant, forecast, isSelected, onClick }) {
  // Calculate forecast average for tomorrow (first 12 hours)
  const forecastAvg = forecast.length > 0
    ? (forecast.slice(0, 12).reduce((sum, f) => sum + f.forecast_mw, 0) / 12).toFixed(1)
    : 0;
  
  // Calculate capacity utilization
  const utilization = plant.capacity_mw > 0
    ? ((plant.current_output_mw / plant.capacity_mw) * 100).toFixed(1)
    : 0;
  
  return (
    <div 
      className={`plant-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="plant-header">
        <div className="plant-name">{plant.name}</div>
        <span className={`type-badge ${plant.type}`}>
          {plant.type === 'solar' ? '☀️ Solar' : '💨 Wind'}
        </span>
      </div>
      
      <div className="plant-stats">
        <div className="stat-row">
          <span className="stat-label">Capacity</span>
          <span className="stat-number">{plant.capacity_mw} MW</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Current Output</span>
          <span className="stat-number">{plant.current_output_mw.toFixed(1)} MW</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Tomorrow Avg</span>
          <span className="stat-number">{forecastAvg} MW</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Utilization</span>
          <span className="stat-number">{utilization}%</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Region</span>
          <span className="stat-number">{plant.region}</span>
        </div>
      </div>
    </div>
  );
}

export default PlantCard;
