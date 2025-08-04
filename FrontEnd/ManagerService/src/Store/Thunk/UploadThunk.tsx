import { showToast } from "@/components/UI/Toast/ToastUI.tsx";
import { useFileStore } from "@/zustand/File.tsx";
import {API_ROUTES} from "@/Api/UrlApi.tsx";

export interface UploadResponse {
    idImage: string;
    publicId: string;
    urlImage: string;
}

// Middleware thunk
export const MiddleUploadImage = () => {
    return async function (): Promise<UploadResponse | null> {
        try {
            const { file } = useFileStore.getState(); // ✅ lấy file từ zustand

            if (!file) {
                showToast({
                    title: "No File",
                    description: "Please choose a file before uploading.",
                    color: "warning",
                });
                return null;
            }

            const formData = new FormData();
            formData.append("file", file); // ✅ gán file vào form data
            const res = await fetch(API_ROUTES.file.uploadImage, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed with status " + res.status);
            }

            const data: UploadResponse = await res.json();

            showToast({
                title: "Upload Successful",
                description: "Image uploaded successfully.",
                color: "success",
            });

            return data;
        } catch (error: any) {
            showToast({
                title: "Upload Failed",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
            return null;
        }
    };
};
