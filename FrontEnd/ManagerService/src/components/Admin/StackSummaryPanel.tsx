"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Progress } from "@heroui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

type StackStats = {
  total: number;
  loaded: number;
  free: number;
  empty: number;
};

type StackSummaryPanelProps = {
  stack?: { id: string };
  stats: StackStats;
};

const StackSummaryPanel: React.FC<StackSummaryPanelProps> = ({
  stack,
  stats,
}) => {
  const { total, loaded, free, empty } = stats;
  const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;

  const chartData = {
    labels: ["Loaded", "Free", "Empty"],
    datasets: [
      {
        data: [loaded, free, empty],
        backgroundColor: ["#facc15", "#4ade80", "#d1d5db"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw;
            const totalValue = tooltipItem.dataset.data.reduce(
              (sum: number, val: number) => sum + val,
              0,
            );
            const percentage =
              totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;

            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {stack ? `Stack ${stack.id}` : "Select a Stack"}
      </h2>

      <div className="space-y-2 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <StatRow label="Total Bin" value={total} />
        <StatRow label="Loaded" value={loaded} />
        <StatRow label="Free" value={free} />
        <StatRow label="Empty" value={empty} />
      </div>

      <div>
        <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          <span>Usage</span>
          <span>{percent}%</span>
        </div>
        <Progress
          className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 accent-orange-500"
          value={percent}
        />
      </div>

      <div className="w-full max-w-xs mx-auto mt-6">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const StatRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between text-sm">
    <span>{label}</span>
    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default StackSummaryPanel;
