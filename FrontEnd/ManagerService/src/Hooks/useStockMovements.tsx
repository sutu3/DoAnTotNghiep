import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/Api/UrlApi.tsx';
import {fetchApi} from "@/Api/FetchApi.tsx";
import {ApiResponse} from "@/types";
import {StockMovement} from "@/Store/StockMovementSlice.tsx";



export const useStockMovements = (warehouseId: string, timeFilter: string) => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovements = async () => {
            setLoading(true);
            setError(null);

            try {
                const now = new Date();
                let fromDate: Date;

                switch (timeFilter) {
                    case 'today':
                        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        break;
                    case 'week':
                        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'month':
                        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                }

                const fromDateStr = fromDate.toISOString();
                const toDateStr = now.toISOString();

                let url: string;
                if (warehouseId === "ALL") {
                    // API cho tất cả warehouse
                    url = `${API_ROUTES.inventory.movements(null).allWarehouseDateRange(fromDateStr, toDateStr)}`;
                } else if (warehouseId) {
                    // API cho warehouse cụ thể
                    url = `${API_ROUTES.inventory.movements(null).warehouseDateRange(warehouseId, fromDateStr, toDateStr)}`;
                } else {
                    return;
                }

                const response: ApiResponse<StockMovement[]> = await fetchApi({
                    method: "GET",
                    url,
                    body: undefined,
                    headers: undefined
                });

                if (!response.success) {
                    throw new Error('Failed to fetch stock movements');
                }

                const data = response.result;
                setMovements(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setMovements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovements();
    }, [warehouseId, timeFilter]);

    return { movements, loading, error };
};