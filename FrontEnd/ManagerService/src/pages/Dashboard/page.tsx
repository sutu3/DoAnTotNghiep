"use client";

import  { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
  Button,
  Select,
  SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { StacksSelector } from "@/Store/Selector.tsx";
import {useNavigate} from "react-router-dom";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockItems: number;
  activeUsers: number;
  warehouseCapacity: number;
}

export default function Daskboard() {
  const stacks = useSelector(StacksSelector);
  const [timeFilter, setTimeFilter] = useState("today");
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 3432,
    pendingOrders: 156,
    completedOrders: 3276,
    totalRevenue: 532000000,
    totalProducts: 2453,
    lowStockItems: 23,
    activeUsers: 45,
    warehouseCapacity: 85
  });

  const quickActions = [
    { label: "Tạo đơn nhập", icon: "mdi:package-down", color: "success", path: "/staff/request-import" },
    { label: "Tạo đơn xuất", icon: "mdi:package-up", color: "warning", path: "/staff/request-export" },
    { label: "Kiểm kê kho", icon: "mdi:clipboard-list", color: "primary", path: "/admin/inventory/check" },
    { label: "Quản lý bin", icon: "mdi:grid", color: "secondary", path: "/admin/locations" },
    { label: "Nhập hàng vào kho", icon: "mdi:package-variant", color: "primary", path: "/staff/import"},
    { label: "Xuất hàng khỏi kho", icon: "mdi:package-variant-remove", color: "danger", path: "/staff/export"},

  ];

  const recentActivities = [
    { id: 1, type: "import", description: "Nhập 50 laptop Dell", time: "2 phút trước", status: "completed" },
    { id: 2, type: "export", description: "Xuất 25 chuột Logitech", time: "15 phút trước", status: "pending" },
    { id: 3, type: "inventory", description: "Kiểm kê kho A", time: "1 giờ trước", status: "in_progress" },
    { id: 4, type: "maintenance", description: "Bảo trì bin B-001", time: "2 giờ trước", status: "completed" }
  ];

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Quản Lý Kho
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Tổng quan hoạt động kho hàng hôm nay
              </p>
            </div>
            <div className="flex gap-3">
              <Select
                  size="sm"
                  selectedKeys={[timeFilter]}
                  onSelectionChange={(keys) => setTimeFilter(Array.from(keys)[0] as string)}
                  className="w-32"
              >
                <SelectItem key="today">Hôm nay</SelectItem>
                <SelectItem key="week">Tuần này</SelectItem>
                <SelectItem key="month">Tháng này</SelectItem>
              </Select>
              <Button color="primary" startContent={<Icon icon="mdi:refresh" />}>
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tổng đơn hàng
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalOrders.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      <Icon icon="mdi:trending-up" className="inline mr-1" />
                      +12% so với hôm qua
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Icon icon="mdi:package-variant" className="text-2xl text-blue-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Doanh thu
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(stats.totalRevenue / 1000000).toFixed(1)}M ₫
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      <Icon icon="mdi:trending-up" className="inline mr-1" />
                      +8% so với hôm qua
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <Icon icon="mdi:currency-usd" className="text-2xl text-green-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Sản phẩm
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalProducts.toLocaleString()}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      <Icon icon="mdi:alert" className="inline mr-1" />
                      {stats.lowStockItems} sắp hết hàng
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Icon icon="mdi:cube-outline" className="text-2xl text-orange-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Sức chứa kho
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.warehouseCapacity}%
                    </p>
                    <Progress
                        value={stats.warehouseCapacity}
                        color="secondary"
                        size="sm"
                        className="mt-2"
                    />
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Icon icon="mdi:warehouse" className="text-2xl text-purple-600" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thao Tác Nhanh
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="flat"
                        color={action.color as any}
                        className="h-20 flex-col gap-2"
                        onClick={()=>{
                          navigate(action.path)
                        }}

                        startContent={<Icon icon={action.icon} className="text-2xl" />}
                    >
                      {action.label}
                    </Button>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hoạt Động Gần Đây
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Icon
                              icon={
                                activity.type === 'import' ? 'mdi:package-down' :
                                    activity.type === 'export' ? 'mdi:package-up' :
                                        activity.type === 'inventory' ? 'mdi:clipboard-list' :
                                            'mdi:wrench'
                              }
                              className="text-blue-600"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                        <Chip
                            size="sm"
                            color={
                              activity.status === 'completed' ? 'success' :
                                  activity.status === 'pending' ? 'warning' :
                                      'primary'
                            }
                            variant="flat"
                        >
                          {activity.status === 'completed' ? 'Hoàn thành' :
                              activity.status === 'pending' ? 'Chờ xử lý' :
                                  'Đang thực hiện'}
                        </Chip>
                      </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Warehouse Overview */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tổng Quan Kho
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.warehouseCapacity / 100)}`}
                            className="text-blue-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">  
                                                {stats.warehouseCapacity}%  
                                            </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Sức chứa kho
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tổng Stack</span>
                      <span className="font-semibold">{stacks?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Người dùng hoạt động</span>
                      <span className="font-semibold">{stats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sản phẩm tồn kho</span>
                      <span className="font-semibold">{stats.totalProducts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Mặt hàng sắp hết</span>
                      <span className="font-semibold text-red-600">{stats.lowStockItems}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
  );
}
