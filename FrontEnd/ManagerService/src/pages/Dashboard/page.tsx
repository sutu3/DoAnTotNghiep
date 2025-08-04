
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
  Button,
  Select,
  SelectItem,
  Spinner, CardFooter
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { StacksSelector } from "@/Store/Selector.tsx";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/Hooks/useDashboardStats.ts";
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";
import {useStockMovements} from "@/Hooks/useStockMovements.tsx";
import ProductTable from "@/pages/Dashboard/Component/ProductTable.tsx";

export default function Dashboard() {
  const stacks = useSelector(StacksSelector);
  const [warehouse, setWarehouse] = useState("");
  const [timeFilter, setTimeFilter] = useState("today");

  const { stats, loading: statsLoading, error: statsError } = useDashboardStats(warehouse, timeFilter);
  const { movements, loading: movementsLoading, error: movementsError } = useStockMovements(warehouse, timeFilter);

  const navigate = useNavigate();

  const quickActions = [
    { label: "Tạo đơn nhập", icon: "mdi:package-down", color: "success", path: "/staff/request-import" },
    { label: "Tạo đơn xuất", icon: "mdi:package-up", color: "warning", path: "/staff/request-export" },
    { label: "Kiểm kê kho", icon: "mdi:clipboard-list", color: "primary", path: "/staff/check-inventory" },
    { label: "Nhập hàng vào kho", icon: "mdi:package-variant", color: "primary", path: "/staff/import"},
    { label: "Xuất hàng khỏi kho", icon: "mdi:package-variant-remove", color: "danger", path: "/staff/export"},
    { label: "Quản lý bin", icon: "mdi:grid", color: "secondary", path: "/admin/locations" },
  ];

  // Helper functions  
  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'IMPORT': return 'mdi:package-down';
      case 'EXPORT': return 'mdi:package-up';
      case 'TRANSFER': return 'mdi:swap-horizontal';
      case 'ADJUSTMENT': return 'mdi:pencil';
      default: return 'mdi:package-variant';
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'IMPORT': return 'success';
      case 'EXPORT': return 'danger';
      case 'TRANSFER': return 'primary';
      case 'ADJUSTMENT': return 'warning';
      default: return 'default';
    }
  };

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'IMPORT': return 'Nhập kho';
      case 'EXPORT': return 'Xuất kho';
      case 'TRANSFER': return 'Chuyển kho';
      case 'ADJUSTMENT': return 'Điều chỉnh';
      default: return type;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

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
                Tổng quan hoạt động kho hàng {timeFilter === 'today' ? 'hôm nay' : timeFilter === 'week' ? 'tuần này' : 'tháng này'}
              </p>
            </div>
            <div className="flex gap-3 w-[400px]">
              <SelectWarehouseApproved warehouse={warehouse} setWarehouse={setWarehouse}/>
              <Select
                  size="sm"
                  selectedKeys={[timeFilter]}
                  onSelectionChange={(keys) => setTimeFilter(Array.from(keys)[0] as string)}
                  className="w-[250px]"
              >
                <SelectItem key="today">Hôm nay</SelectItem>
                <SelectItem key="week">Tuần này</SelectItem>
                <SelectItem key="month">Tháng này</SelectItem>
              </Select>
              <Button
                  color="primary"
                  startContent={<Icon icon="mdi:refresh" />}
                  onClick={() => window.location.reload()}
              >
                Làm mới
              </Button>
            </div>
          </div>

          {/* Stats Cards - Giữ nguyên như code cũ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tổng đơn hàng
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? <Spinner size="sm" /> : stats?.totalOrders?.toLocaleString() || "0"}
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
                      Giá trị tồn kho
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statsLoading ? <Spinner size="sm" /> : `${(stats?.totalInventoryValue / 1000000)?.toFixed(1) || "0"}M ₫`}
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
                      {statsLoading ? <Spinner size="sm" /> : stats?.totalProducts?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      <Icon icon="mdi:alert" className="inline mr-1" />
                      {stats?.lowStockItems || 0} sắp hết hàng
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
                      {statsLoading ? <Spinner size="sm" /> : `${stats?.warehouseCapacity || 0}%`}
                    </p>
                    <Progress
                        value={stats?.warehouseCapacity || 0}
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

          {/* Quick Actions - Giữ nguyên */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thao Tác Nhanh
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="flat"
                        color={action.color as any}
                        className="h-20 flex-col gap-2"
                        onClick={() => navigate(action.path)}
                        startContent={<Icon icon={action.icon} className="text-2xl" />}
                    >
                      {action.label}
                    </Button>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sản phẩm trong kho
              </h3>
            </CardHeader>
            <CardBody>
              {statsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" />
                  </div>
              ) : (
                  <ProductTable
                      warehouseId={warehouse}
                      showActions={true}
                      maxHeight="500px"
                  />
              )}
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities - Thay thế bằng Stock Movements thực */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hoạt Động Gần Đây
                </h3>
                {movementsLoading && <Spinner size="sm" />}
              </CardHeader>
              <CardBody>
                {movementsError ? (
                    <div className="text-center py-8">
                      <Icon icon="mdi:alert-circle" className="text-4xl text-red-500 mx-auto mb-2" />
                      <p className="text-red-600">Không thể tải dữ liệu: {movementsError}</p>
                    </div>
                ) : movements.length === 0 && !movementsLoading ? (
                    <div className="text-center py-8">
                      <Icon icon="mdi:package-variant-closed" className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        {warehouse ? 'Không có hoạt động nào trong khoảng thời gian này' : 'Vui lòng chọn kho để xem hoạt động'}
                      </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {movements.slice(0, 5).map((movement) => (
                          <div key={movement.stockMovementId} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className={`p-2 rounded-full ${
                                movement.movementType === 'IMPORT' ? 'bg-green-100 dark:bg-green-900' :
                                    movement.movementType === 'EXPORT' ? 'bg-red-100 dark:bg-red-900' :
                                        movement.movementType === 'TRANSFER' ? 'bg-blue-100 dark:bg-blue-900' :
                                            'bg-orange-100 dark:bg-orange-900'
                            }`}>
                              <Icon
                                  icon={getMovementTypeIcon(movement.movementType)}
                                  className={`text-lg ${
                                      movement.movementType === 'IMPORT' ? 'text-green-600' :
                                          movement.movementType === 'EXPORT' ? 'text-red-600' :
                                              movement.movementType === 'TRANSFER' ? 'text-blue-600' :
                                                  'text-orange-600'
                                  }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {getMovementTypeText(movement.movementType)}
                                </p>
                                <Chip
                                    size="sm"
                                    color={getMovementTypeColor(movement.movementType)}
                                    variant="flat"
                                >
                                  {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                </Chip>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {movement.note || `Sản phẩm: ${movement.product}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTimeAgo(movement.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {movement.quantityBefore} → {movement.quantityAfter}
                              </p>
                              <p className="text-xs text-gray-500">
                                Thay đổi: {movement.quantityAfter - movement.quantityBefore}
                              </p>
                            </div>
                          </div>
                      ))}

                      {movements.length > 2 && (
                          <div className="text-center pt-4">
                            <Button
                                variant="light"
                                color="primary"
                                size="sm"
                                onClick={() => navigate('/staff/check-inventory')}
                            >
                              Xem tất cả ({movements.length} hoạt động)
                            </Button>
                          </div>
                      )}
                    </div>
                )}
              </CardBody>
            </Card>

            {/* Warehouse Overview - Giữ nguyên */}
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
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - (stats?.warehouseCapacity || 0) / 100)}`}
                            className="text-blue-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {statsLoading ? <Spinner size="sm" /> : `${stats?.warehouseCapacity || 0}%`}
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
                      <span className="font-semibold">
                        {statsLoading ? <Spinner size="sm" /> : stats?.activeUsers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sản phẩm tồn kho</span>
                      <span className="font-semibold">
                        {statsLoading ? <Spinner size="sm" /> : stats?.totalProducts?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Mặt hàng sắp hết</span>
                      <span className="font-semibold text-red-600">
                        {statsLoading ? <Spinner size="sm" /> : stats?.lowStockItems || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hoạt động hôm nay</span>
                      <span className="font-semibold text-blue-600">
                        {movementsLoading ? <Spinner size="sm" /> : movements.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>

            </Card>
            {/* Product Table - Thay thế bằng ProductTable */}
          </div>
        </div>
      </div>
  );
}