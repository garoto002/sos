import React from "react";

// Gráfico de barras aprimorado com interatividade e grid
export function BarChartSVG({ data, width = 400, height = 200, color = "#6366f1", label = "" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const barWidth = width / Math.max(data.length, 1);
  const padding = 40;
  const chartHeight = height - padding * 2;
  
  // Calcular as linhas de grade
  const gridLines = 5;
  const gridStep = max / gridLines;
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="bg-white rounded-xl shadow-md">
        {/* Grid lines e valores */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = padding + (chartHeight - (i * (chartHeight / gridLines)));
          const value = Math.round(i * gridStep);
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={padding - 5}
                y={y}
                fontSize={10}
                textAnchor="end"
                alignmentBaseline="middle"
                fill="#6b7280"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Barras e valores */}
        {data.map((d, i) => {
          const barHeight = (d.value / max) * chartHeight;
          const x = i * barWidth + padding + (barWidth - 30) / 2;
          const y = height - padding - barHeight;
          
          return (
            <g key={d.label} className="transition-all duration-300">
              <rect
                x={x}
                y={y}
                width={30}
                height={barHeight}
                fill={color}
                rx={4}
                className="hover:opacity-80 cursor-pointer"
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </rect>
              
              {/* Valor no topo da barra */}
              <text
                x={x + 15}
                y={y - 8}
                fontSize={11}
                textAnchor="middle"
                fill="#4b5563"
                fontWeight="600"
              >
                {d.value}
              </text>
              
              {/* Label abaixo da barra */}
              <text
                x={x + 15}
                y={height - padding + 20}
                fontSize={10}
                textAnchor="middle"
                fill="#4b5563"
                transform={`rotate(45, ${x + 15}, ${height - padding + 20})`}
              >
                {d.label}
              </text>
            </g>
          );
        })}
        
        {/* Título do gráfico */}
        {label && (
          <text
            x={width / 2}
            y={24}
            fontSize={14}
            textAnchor="middle"
            fill="#111827"
            fontWeight="600"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

// Gráfico de pizza aprimorado com legenda e interatividade
export function PieChartSVG({ data, width = 400, height = 200, label = "" }) {
  if (!data || data.length === 0) return null;
  const radius = Math.min(width - 120, height - 40) / 3;
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let startAngle = 0;
  
  const colors = [
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#f59e0b", // Amber
    "#10b981", // Emerald
  ];
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="bg-white rounded-xl shadow-md">
        {/* Título do gráfico */}
        {label && (
          <text
            x={width / 2}
            y={24}
            fontSize={14}
            textAnchor="middle"
            fill="#111827"
            fontWeight="600"
          >
            {label}
          </text>
        )}
        
        {/* Gráfico de pizza */}
        <g transform={`translate(${width/2 - 60}, ${height/2})`}>
          {data.map((d, i) => {
            const percentage = (d.value / total) * 100;
            const angle = (percentage / 100) * Math.PI * 2;
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const endX = Math.cos(startAngle + angle) * radius;
            const endY = Math.sin(startAngle + angle) * radius;
            const startX = Math.cos(startAngle) * radius;
            const startY = Math.sin(startAngle) * radius;
            
            const path = [
              `M ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
              'Z'
            ].join(' ');
            
            // Calcular posição do texto no centro do segmento
            const midAngle = startAngle + angle/2;
            const labelRadius = radius * 0.6;
            const textX = Math.cos(midAngle) * labelRadius;
            const textY = Math.sin(midAngle) * labelRadius;
            
            const segment = (
              <g key={d.label} className="transition-all duration-300">
                <path
                  d={path}
                  fill={colors[i % colors.length]}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <title>{`${d.label}: ${d.value} (${Math.round(percentage)}%)`}</title>
                </path>
                {percentage > 10 && (
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={11}
                    fontWeight="600"
                  >
                    {`${Math.round(percentage)}%`}
                  </text>
                )}
              </g>
            );
            
            startAngle += angle;
            return segment;
          })}
        </g>
        
        {/* Legenda */}
        <g transform={`translate(${width - 150}, 50)`}>
          {data.map((d, i) => (
            <g
              key={d.label}
              transform={`translate(0, ${i * 25})`}
              className="cursor-pointer hover:opacity-80"
            >
              <rect
                width={12}
                height={12}
                fill={colors[i % colors.length]}
                rx={2}
              />
              <text
                x={20}
                y={10}
                fontSize={12}
                fill="#4b5563"
                dominantBaseline="middle"
              >
                {`${d.label} (${d.value})`}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
