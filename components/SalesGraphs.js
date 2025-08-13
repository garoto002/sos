
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraphs = ({ data, setShowGraphs }) => {
  if (!data || !data.labels || !data.values) {
    return null;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Vendas por Produto",
        data: data.values,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Gráficos de Vendas</h2>
      <Bar data={chartData} />
      <button onClick={() => setShowGraphs(false)}>Fechar Gráficos</button>
    </div>
  );
};

export default SalesGraphs;
