import React from 'react';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ForecastChart({ forecast, plantName }) {
  if (!forecast || forecast.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>No forecast data available</div>;
  }

  // Transform data for Recharts
  const chartData = forecast.map(f => ({
    hour: `${f.hour}:00`,
    forecast: f.forecast_mw,
    upper80: f.confidence_80_upper,
    lower80: f.confidence_80_lower,
    upper95: f.confidence_95_upper,
    lower95: f.confidence_95_lower
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        
        <XAxis 
          dataKey="hour" 
          stroke="#718096"
          tick={{ fontSize: 12 }}
          label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10 }}
        />
        
        <YAxis 
          stroke="#718096"
          tick={{ fontSize: 12 }}
          label={{ value: 'Generation (MW)', angle: -90, position: 'insideLeft' }}
        />
        
        <Tooltip 
          contentStyle={{ 
            background: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px'
          }}
          formatter={(value) => `${value.toFixed(2)} MW`}
        />
        
        <Legend 
          verticalAlign="top"
          height={36}
          iconType="line"
        />
        
        {/* 95% Confidence Band (lighter) */}
        <Area 
          type="monotone" 
          dataKey="upper95" 
          stroke="none" 
          fill="#e0e7ff" 
          fillOpacity={0.3}
          name="95% Range"
        />
        <Area 
          type="monotone" 
          dataKey="lower95" 
          stroke="none" 
          fill="#ffffff" 
          fillOpacity={1}
        />
        
        {/* 80% Confidence Band (darker) */}
        <Area 
          type="monotone" 
          dataKey="upper80" 
          stroke="none" 
          fill="#c7d2fe" 
          fillOpacity={0.5}
          name="80% Confidence"
        />
        <Area 
          type="monotone" 
          dataKey="lower80" 
          stroke="none" 
          fill="#ffffff" 
          fillOpacity={1}
        />
        
        {/* Forecast Line */}
        <Line 
          type="monotone" 
          dataKey="forecast" 
          stroke="#667eea" 
          strokeWidth={3}
          dot={{ fill: '#667eea', r: 4 }}
          activeDot={{ r: 6 }}
          name="Forecast"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ForecastChart;
