// utils/fetcher.ts

import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
    method?: Method;
    url: string;
    body?: any;
    headers?: Record<string, string>;
}

export const fetchApi = async <T = any>({
                                            method = "GET",
                                            url,
                                            body,
                                            headers = {},
                                        }: FetchOptions): Promise<T> => {
    const token = localStorage.getItem("token"); // hoặc từ cookies
    console.log(token);
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
        const error = await res.text();
        showToast({
            title: "Error",
            description: `Message: ${error}`,
            color: "danger",
        });
        throw new Error(error); // nên throw để bắt được khi dùng try-catch
    }

    return res.json();
};
