import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/Api/UrlApi.tsx';
import {fetchApi} from "@/Api/FetchApi.tsx";
import {ApiResponse} from "@/types";
import {Unit} from "@/Store/Unit.tsx";
// types/DashboardStatsResponse.ts

export interface DashboardStatsResponse {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalInventoryValue?: number; // BigDecimal => number
    totalProducts: number;
    lowStockItems?: number;
    activeUsers?: number;
    warehouseCapacity: number|0;
    timeFilter: string;
    fromDate: string;   // LocalDateTime => ISO string
    toDate: string;     // LocalDateTime => ISO string
}

export const useDashboardStats = (warehouseId: string, timeFilter: string) => {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!warehouseId) return;

            setLoading(true);
            try {
                const response:ApiResponse<DashboardStatsResponse> = await fetchApi({method:"GET",url:API_ROUTES.dashboard.stats(warehouseId, timeFilter),body:undefined,headers:undefined});
                const data = response.result;
                setStats(data);
            } finally {
                setLoading(false);
            }
        };
        if(warehouseId!=""){
            fetchStats();
        }
    }, [warehouseId, timeFilter]);

    return { stats, loading, error };
};