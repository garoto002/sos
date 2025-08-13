import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SuperadminSalesBarChart({ salesByMonth }) {
  if (!salesByMonth || salesByMonth.length === 0) return null;
  const data = {
    labels: salesByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Vendas por mês",
        data: salesByMonth.map((item) => item.total),
        backgroundColor: "#6366f1",
      },
    ],
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Vendas por Mês</h2>
      <Bar data={data} />
    </div>
  );
}
