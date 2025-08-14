"use client";
import React from "react";

export default function SuperadminStatsCard({ title, value, icon, trend, bgColor = "bg-white", textColor = "text-gray-800" }) {
  return (
    <div className={`p-6 rounded-2xl ${bgColor} shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-2">
        {typeof icon === 'string' ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(trend) >= 0 ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
