import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/Api/UrlApi.tsx';
import {fetchApi} from "@/Api/FetchApi.tsx";
import {ApiResponse} from "@/types";


export interface stats{
    totalTasks: number;
    totalTasksCompleted: number;
    totalTaskPending: number;
    totalTasksInProgress: number;
    totalTasksHightLevel: number;
}
export const useGetStatsTaskUser = () => {
    const [data, setData] = useState<stats|null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {

            setLoading(true);
            setError(null);

            try {


                const response:ApiResponse<stats> = await fetchApi(
                    { method:"GET",
                        url:API_ROUTES.user.taskUsers(null).statsInfor,
                        body:undefined,headers:undefined});

                if (!response.success) {
                    throw new Error('Failed to fetch user');
                }

                const data = response.result;
                setData(data || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { data, loading, error };
};