import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/Api/UrlApi.tsx';
import {fetchApi} from "@/Api/FetchApi.tsx";
import {ApiResponse} from "@/types";



export interface ToTalStockLevel {
    minStockLevel:number;
    maxStockLevel:number;
}

export const useStockLevel = (productId: string | null) => {
    const [data, setData] = useState<ToTalStockLevel|null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;

            setLoading(true);
            try {
                const response:ApiResponse<ToTalStockLevel> = await fetchApi({
                    method:"GET",
                    url:API_ROUTES.inventory.InventoryProduct(null).search().byProductId(productId).getProduct,
                    headers:undefined,
                    body:undefined});
                const result =response.result;
                setData(result);
            }  finally {
                setLoading(false);
            }
        };
        if(productId!=""){
            fetchData();
        }
    }, [productId]);

    return { data, loading, error };
};