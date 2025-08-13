import React from "react";

// Gráfico de barras simples SVG
export function BarChartSVG({ data, width = 400, height = 180, color = "#6366f1", label = "" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const barWidth = width / data.length;
  return (
    <svg width={width} height={height} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e0e7ff" }}>
      {data.map((d, i) => (
        <g key={d.label}>
          <rect
            x={i * barWidth + 20}
            y={height - (d.value / max) * (height - 40) - 20}
            width={barWidth - 30}
            height={(d.value / max) * (height - 40)}
            fill={color}
            rx={6}
          />
          <text x={i * barWidth + barWidth / 2 + 5} y={height - 5} fontSize={12} textAnchor="middle" fill="#444">{d.label}</text>
          <text x={i * barWidth + barWidth / 2 + 5} y={height - (d.value / max) * (height - 40) - 25} fontSize={12} textAnchor="middle" fill="#222" fontWeight="bold">{d.value}</text>
        </g>
      ))}
      {label && <text x={width/2} y={18} fontSize={16} textAnchor="middle" fill="#222" fontWeight="bold">{label}</text>}
    </svg>
  );
}

// Gráfico de pizza SVG
export function PieChartSVG({ data, width = 220, height = 220, label = "" }) {
  if (!data || data.length === 0) return null;
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let accAngle = 0;
  const colors = ["#6366f1", "#10b981", "#f59e42", "#ef4444", "#f472b6", "#0ea5e9", "#a21caf"];
  const radius = Math.min(width, height) / 2 - 20;
  const cx = width / 2;
  const cy = height / 2;
  return (
    <svg width={width} height={height} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e0e7ff" }}>
      {data.map((d, i) => {
        const startAngle = accAngle;
        const angle = (d.value / total) * 2 * Math.PI;
        accAngle += angle;
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(accAngle);
        const y2 = cy + radius * Math.sin(accAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
        return (
          <g key={d.label}>
            <path d={pathData} fill={colors[i % colors.length]} />
            <text x={cx + (radius + 18) * Math.cos(startAngle + angle / 2)} y={cy + (radius + 18) * Math.sin(startAngle + angle / 2)} fontSize={12} textAnchor="middle" fill="#222">{d.label}</text>
          </g>
        );
      })}
      {label && <text x={width/2} y={22} fontSize={16} textAnchor="middle" fill="#222" fontWeight="bold">{label}</text>}
    </svg>
  );
}
