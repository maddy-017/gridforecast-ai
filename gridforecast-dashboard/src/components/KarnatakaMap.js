import React from 'react';

function KarnatakaMap({ plants, selectedPlant, onPlantSelect }) {
  // Simple SVG map representation
  // Karnataka approximate bounds: 11.5°N to 18.5°N, 74°E to 78.5°E
  
  const mapWidth = 400;
  const mapHeight = 500;
  
  // Convert lat/lon to SVG coordinates
  const latToY = (lat) => {
    const minLat = 11.5;
    const maxLat = 18.5;
    return ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
  };
  
  const lonToX = (lon) => {
    const minLon = 74;
    const maxLon = 78.5;
    return ((lon - minLon) / (maxLon - minLon)) * mapWidth;
  };

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', background: '#f7fafc', borderRadius: '8px', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        {/* Karnataka state outline (simplified) */}
        <rect 
          x="0" 
          y="0" 
          width={mapWidth} 
          height={mapHeight} 
          fill="#e6f7ff" 
          stroke="#91d5ff" 
          strokeWidth="2"
        />
        
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line 
            key={`h${i}`}
            x1="0" 
            y1={i * (mapHeight / 4)} 
            x2={mapWidth} 
            y2={i * (mapHeight / 4)} 
            stroke="#d9d9d9" 
            strokeWidth="0.5"
            strokeDasharray="5,5"
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <line 
            key={`v${i}`}
            x1={i * (mapWidth / 4)} 
            y1="0" 
            x2={i * (mapWidth / 4)} 
            y2={mapHeight} 
            stroke="#d9d9d9" 
            strokeWidth="0.5"
            strokeDasharray="5,5"
          />
        ))}
        
        {/* Plant markers */}
        {plants.map((plant) => {
          const x = lonToX(plant.lon);
          const y = latToY(plant.lat);
          const isSelected = selectedPlant?.name === plant.name;
          const isSolar = plant.type === 'solar';
          
          return (
            <g key={plant.name} onClick={() => onPlantSelect(plant)} style={{ cursor: 'pointer' }}>
              {/* Marker circle */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 16 : 12}
                fill={isSolar ? '#fbbf24' : '#3b82f6'}
                stroke={isSelected ? '#1e40af' : 'white'}
                strokeWidth={isSelected ? 3 : 2}
                opacity={0.9}
              />
              
              {/* Icon */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize={isSelected ? 14 : 12}
                fontWeight="bold"
              >
                {isSolar ? '☀' : '💨'}
              </text>
              
              {/* Label */}
              <text
                x={x}
                y={y + (isSelected ? 35 : 30)}
                textAnchor="middle"
                fill="#1a202c"
                fontSize={isSelected ? 11 : 9}
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {plant.region}
              </text>
              
              {/* Capacity label */}
              <text
                x={x}
                y={y + (isSelected ? 48 : 42)}
                textAnchor="middle"
                fill="#718096"
                fontSize={8}
              >
                {plant.capacity_mw} MW
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#2d3748' }}>Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fbbf24' }}></div>
          <span>Solar Plant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6' }}></div>
          <span>Wind Farm</span>
        </div>
      </div>
    </div>
  );
}

export default KarnatakaMap;
