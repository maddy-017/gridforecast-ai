import React from 'react';

function ExplanationPanel({ selectedPlant }) {
  if (!selectedPlant) return null;

  const isSolar = selectedPlant.type === 'solar';

  return (
    <div className="explanation-panel">
      <h2>🧠 How This Forecast Works</h2>
      
      <div className="explanation-content">
        <div className="explanation-item">
          <strong>Model Architecture</strong>
          <p>
            GridForecast AI uses a <strong>Temporal Fusion Transformer (TFT)</strong> as the primary forecasting model,
            validated with a <strong>LightGBM ensemble</strong>. TFT is a state-of-the-art deep learning architecture
            specifically designed for multi-horizon time-series forecasting with interpretable attention mechanisms.
          </p>
        </div>

        <div className="explanation-item">
          <strong>Data Sources</strong>
          <p>
            The model is trained on 2+ years of historical generation data combined with weather forecasts from
            IMD (India Meteorological Department) and ERA5 reanalysis. Key inputs include: {' '}
            {isSolar 
              ? 'solar irradiance (GHI/DNI), cloud cover percentage, ambient temperature, and panel degradation factors.'
              : 'wind speed at hub height (100m), wind direction, atmospheric pressure, and seasonal patterns.'
            }
          </p>
        </div>

        <div className="explanation-item">
          <strong>Uncertainty Quantification</strong>
          <p>
            Confidence intervals are generated using <strong>Conformal Prediction</strong> — a model-agnostic technique
            that provides statistically valid prediction intervals. The shaded bands show 80% and 95% confidence ranges,
            meaning the actual generation will fall within these bounds 80% and 95% of the time respectively.
          </p>
        </div>

        <div className="explanation-item">
          <strong>Key Forecast Drivers for {selectedPlant.name}</strong>
          <p>
            {isSolar ? (
              <>
                <strong>Primary factors:</strong> Cloud cover arrival patterns (45% impact), solar angle and time of day (30%),
                ambient temperature effects on panel efficiency (15%), and seasonal irradiance variations (10%).
                {' '}Tomorrow's forecast accounts for expected afternoon cloud cover based on IMD's latest weather model.
              </>
            ) : (
              <>
                <strong>Primary factors:</strong> Wind speed at turbine height (55% impact), wind direction relative to
                turbine orientation (25%), atmospheric stability and boundary layer height (12%), and seasonal monsoon patterns (8%).
                {' '}Tomorrow's forecast shows typical diurnal variation with peak generation expected in evening hours.
              </>
            )}
          </p>
        </div>

        <div className="explanation-item">
          <strong>Explainability (SHAP)</strong>
          <p>
            Each forecast is accompanied by SHAP (SHapley Additive exPlanations) values that break down
            which input features contributed most to the prediction. This ensures grid operators understand
            not just "what" the forecast is, but "why" the model made that prediction — critical for
            building trust and enabling informed decision-making under uncertainty.
          </p>
        </div>

        <div className="explanation-item">
          <strong>Deployment Architecture</strong>
          <p>
            GridForecast AI operates as a non-intrusive forecasting layer that reads data from existing SCADA/EMS systems
            without modifying them. Forecasts are updated hourly (intra-day) and daily (day-ahead), with all processing
            running on-premise to ensure data sovereignty. The system requires no hosted LLMs and uses only open-source
            ML libraries (PyTorch, LightGBM, scikit-learn).
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExplanationPanel;
