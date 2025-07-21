import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Progress, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { StackType } from "@/Store/StackSlice.tsx";
import {
  Layers,
  Package,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

type StackSummaryPanelProps = {
  stack?: StackType;
};

const StackSummaryPanel: React.FC<StackSummaryPanelProps> = ({ stack }) => {
  const total = stack?.bin?.length ?? 0;
  const maintenance = stack?.bin?.filter((b) => b.status === "MAINTENANCE").length ?? 0;
  const full = stack?.bin?.filter((b) => b.status === "AVAILABLE").length ?? 0;
  const empty = stack?.bin?.filter((b) => b.status === "EMPTY").length ?? 0;
  const usagePercent = total > 0 ? Math.round(((full + maintenance) / total) * 100) : 0;

  const chartData = {
    labels: ["Available", "In Use", "Maintenance"],
    datasets: [
      {
        data: [empty, full, maintenance],
        backgroundColor: [
          "#10b981", // emerald-500 - Available
          "#3b82f6", // blue-500 - In Use
          "#f59e0b", // amber-500 - Maintenance
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          "#059669", // emerald-600
          "#2563eb", // blue-600
          "#d97706", // amber-600
        ],
      },
    ],
  };

  const chartOptions = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create custom legend
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw;
            const totalValue = tooltipItem.dataset.data.reduce(
                (sum: number, val: number) => sum + val,
                0
            );
            const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
            return `${label}: ${value} bins (${percentage}%)`;
          },
        },
      },
    },
  };


  return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {stack ? stack.stackName : "Select a Stack"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Storage Location Overview
              </p>
            </div>
            {stack && (
                <Chip
                    color="primary"
                    variant="flat"
                    size="sm"
                    startContent={<TrendingUp className="w-3 h-3" />}
                >
                  {usagePercent}% Used
                </Chip>
            )}
          </div>
        </CardHeader>

        <CardBody className="pt-2">
          {!stack ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Layers className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a stack to view detailed statistics
                </p>
              </div>
          ) : (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                      label="Available"
                      value={empty}
                      total={total}
                      color="success"
                      icon={<CheckCircle className="w-4 h-4" />}
                  />
                  <StatCard
                      label="In Use"
                      value={full}
                      total={total}
                      color="primary"
                      icon={<Package className="w-4 h-4" />}
                  />
                  <StatCard
                      label="Maintenance"
                      value={maintenance}
                      total={total}
                      color="warning"
                      icon={<AlertTriangle className="w-4 h-4" />}
                  />
                </div>

                <Divider />

                {/* Usage Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Storage Utilization
                </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {usagePercent}%
                </span>
                  </div>
                  <Progress
                      value={usagePercent}
                      color={usagePercent > 80 ? "danger" : usagePercent > 60 ? "warning" : "success"}
                      size="md"
                      className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{full + maintenance} bins occupied</span>
                    <span>{empty} bins available</span>
                  </div>
                </div>

                <Divider />

                {/* Chart Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    Distribution Overview
                  </h4>

                  <div className="relative">
                    <div className="w-48 h-48 mx-auto relative">
                      <Doughnut data={chartData} options={chartOptions} />
                      {/* Center text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {total}
                    </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                      Total Bins
                    </span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Legend */}
                  <div className="flex justify-center gap-4">
                    <LegendItem
                        color="bg-emerald-500"
                        label="Available"
                        value={empty}
                    />
                    <LegendItem
                        color="bg-blue-500"
                        label="In Use"
                        value={full}
                    />
                    <LegendItem
                        color="bg-amber-500"
                        label="Maintenance"
                        value={maintenance}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                {stack.warehouse && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                    Located in: <span className="font-medium">{stack.warehouse.warehouseName}</span>
                  </span>
                      </div>
                    </div>
                )}
              </div>
          )}
        </CardBody>
      </Card>
  );
};

// Helper Components
const StatCard = ({
                    label,
                    value,
                    total,
                    color,
                    icon
                  }: {
  label: string;
  value: number;
  total: number;
  color: "success" | "primary" | "warning";
  icon: React.ReactNode;
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1 rounded ${
              color === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400" :
                  color === "primary" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" :
                      "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
          }`}>
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{percentage}%</p>
        </div>
      </div>
  );
};

const LegendItem = ({
                      color,
                      label,
                      value
                    }: {
  color: string;
  label: string;
  value: number;
}) => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-xs text-gray-600 dark:text-gray-400">
      {label}: <span className="font-medium">{value}</span>
    </span>
    </div>
);

export default StackSummaryPanel;