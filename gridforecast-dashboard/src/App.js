import React, { useState, useEffect } from 'react';
import './App.css';
import SummaryStats from './components/SummaryStats';
import PlantCard from './components/PlantCard';
import ForecastChart from './components/ForecastChart';
import KarnatakaMap from './components/KarnatakaMap';
import ExplanationPanel from './components/ExplanationPanel';

function App() {
  const [plants, setPlants] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const [summary, setSummary] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all data
    Promise.all([
      fetch('/data/plants.json').then(r => r.json()),
      fetch('/data/forecasts.json').then(r => r.json()),
      fetch('/data/summary.json').then(r => r.json())
    ]).then(([plantsData, forecastsData, summaryData]) => {
      setPlants(plantsData);
      setForecasts(forecastsData);
      setSummary(summaryData);
      setSelectedPlant(plantsData[0]); // Default to first plant
      setLoading(false);
    }).catch(error => {
      console.error('Error loading data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading GridForecast AI...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>⚡ GridForecast AI</h1>
          <p className="subtitle">Karnataka Renewable Energy Forecasting System</p>
        </div>
      </header>

      {/* Summary Stats */}
      {summary && <SummaryStats summary={summary} plants={plants} />}

      {/* Main Content */}
      <div className="main-content">
        {/* Left: Map */}
        <div className="map-section">
          <h2>Karnataka Plants</h2>
          <KarnatakaMap 
            plants={plants} 
            selectedPlant={selectedPlant}
            onPlantSelect={setSelectedPlant}
          />
        </div>

        {/* Right: Forecast Chart */}
        <div className="chart-section">
          <h2>
            24-Hour Forecast: {selectedPlant?.name}
            <span className="plant-type-badge">{selectedPlant?.type}</span>
          </h2>
          <ForecastChart 
            forecast={forecasts[selectedPlant?.name] || []}
            plantName={selectedPlant?.name}
          />
        </div>
      </div>

      {/* Plant Cards */}
      <div className="plants-grid">
        <h2>All Plants Overview</h2>
        <div className="cards-container">
          {plants.map(plant => (
            <PlantCard 
              key={plant.name}
              plant={plant}
              forecast={forecasts[plant.name] || []}
              isSelected={selectedPlant?.name === plant.name}
              onClick={() => setSelectedPlant(plant)}
            />
          ))}
        </div>
      </div>

      {/* Explanation Panel */}
      <ExplanationPanel selectedPlant={selectedPlant} />

      {/* Footer */}
      <footer className="footer">
        <p>GridForecast AI — AI for Bharat 2026 Hackathon | Theme 10: Renewable Generation Forecasting</p>
        <p>Team: Abdulmoid Bangi & Farhan Shaikh</p>
      </footer>
    </div>
  );
}

export default App;
