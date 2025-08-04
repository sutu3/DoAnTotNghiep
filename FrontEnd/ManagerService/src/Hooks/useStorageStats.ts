// FrontEnd/ManagerService/src/Hooks/useStorageStats.ts
import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/Api/UrlApi.tsx';
import { StackCapacityInfo } from '@/Hooks/useNearFullStacks.tsx';
import { fetchApi } from '@/Api/FetchApi.tsx';
import { ApiResponse } from '@/types';

export interface WarehouseCapacityStatsResponse {
    totalBins: number;
    emptyBins: number;
    occupiedBins: number;
    utilizationPercentage: number;
    criticalStacks: number;
    warningStacks: number;
    stackDetails: StackCapacityInfo[];
}

export interface StorageAlertResponse {
    type: "critical" | "warning" | "info";
    title: string;
    message: string;
    stackId: string;
    stackName: string;
    utilizationPercentage: number;
    severity: "HIGH" | "MEDIUM" | "LOW";
    createdAt: string;
}

export interface StackCapacityDetailResponse {
    stackId: string;
    stackName: string;
    description: string;
    totalBins: number;
    emptyBins: number;
    occupiedBins: number;
    maintenanceBins: number;
    utilizationPercentage: number;
    status: "critical" | "warning" | "normal";
    createdAt: string;
    updatedAt: string;
}

export interface StorageStatsData {
    capacity: WarehouseCapacityStatsResponse;
    alerts: StorageAlertResponse[];
    stacks: StackCapacityDetailResponse[];
}

export const useStorageStats = (warehouseId: string, timeFilter: string) => {
    const [data, setData] = useState<StorageStatsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!warehouseId || warehouseId === 'all') {
                console.warn("Không fetch storage stats vì warehouseId không hợp lệ:", warehouseId);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const [
                    capacityStats,
                    alerts,
                    stackDetails
                ]: [
                    ApiResponse<WarehouseCapacityStatsResponse>,
                    ApiResponse<StorageAlertResponse[]>,
                    ApiResponse<StackCapacityDetailResponse[]>
                ] = await Promise.all([
                    fetchApi({
                        method: "GET",
                        url: API_ROUTES.warehouse.warehouses(null).capacityStats(warehouseId, timeFilter)
                    }),
                    fetchApi({
                        method: "GET",
                        url: API_ROUTES.warehouse.warehouses(null).storageAlerts(warehouseId)
                    }),
                    fetchApi({
                        method: "GET",
                        url: API_ROUTES.warehouse.warehouses(null).stackCapacityDetails(warehouseId)
                    })
                ]);

                if (!capacityStats.success || !alerts.success || !stackDetails.success) {
                    throw new Error("Lỗi khi gọi API lấy dữ liệu thống kê lưu trữ");
                }

                const capacityData = capacityStats.result;
                const alertsData = alerts.result;
                const stackData = stackDetails.result;

                setData({
                    capacity: capacityData,
                    alerts: alertsData,
                    stacks: stackData
                });
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if(warehouseId!=""){
            fetchData();
        }
    }, [warehouseId, timeFilter]);

    return { data, loading, error };
};
