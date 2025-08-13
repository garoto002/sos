import React from "react";

export default function SuperadminStatsCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center border-2 ${color} bg-white`}> 
      <div className="text-4xl mb-2">{icon}</div>
      <span className="text-3xl font-bold mb-1">{value}</span>
      <span className="font-medium text-gray-700">{title}</span>
    </div>
  );
}
