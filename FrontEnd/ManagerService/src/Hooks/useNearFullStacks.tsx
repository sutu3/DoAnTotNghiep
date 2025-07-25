import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/Api/UrlApi.tsx';
import {fetchApi} from "@/Api/FetchApi.tsx";
import {ApiResponse} from "@/types";

export interface NearFullStacksResponse {
    warehouseId: string;
    warehouseName: string;
    totalStacks: number;
    nearFullStacksCount: number;
    nearFullPercentage: number;
    nearFullStacks: StackCapacityInfo[];
}

export interface StackCapacityInfo {
    stackId: string;
    stackName: string;
    totalBins: number;
    occupiedBins: number;
    emptyBins: number;
    utilizationPercentage: number;
    status: "critical" | "warning" | "normal";
}

export const useNearFullStacks = (warehouseId: string, threshold: number = 90) => {
    const [data, setData] = useState<NearFullStacksResponse[]|null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!warehouseId) return;

            setLoading(true);
            try {
                const response:ApiResponse<NearFullStacksResponse[]> = await fetchApi({
                    method:"GET",
                    url:API_ROUTES.warehouse.warehouses(null).nearFullStacks(warehouseId, threshold),
                    headers:undefined,
                    body:undefined});
                const result =response.result;
                setData(result);
            }  finally {
                setLoading(false);
            }
        };
        if(warehouseId!=""){
            fetchData();
        }
    }, [warehouseId, threshold]);

    return { data, loading, error };
};