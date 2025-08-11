import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_ROUTES } from '@/Api/UrlApi';

interface UploadImageResponse {
    imageId: string;
    imageUrl: string;
    fileName: string;
    fileSize: number;
    uploadDate: string;
}

// Upload single image
export const uploadImage = createAsyncThunk(
    'file/uploadImage',
    async (file: File, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(API_ROUTES.file.uploadImage, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result as UploadImageResponse;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Upload failed');
        }
    }
);

// Upload multiple images
export const uploadMultipleImages = createAsyncThunk(
    'file/uploadMultipleImages',
    async (files: File[], { rejectWithValue, dispatch }) => {
        try {
            const uploadPromises = files.map(file => dispatch(uploadImage(file)));
            const results = await Promise.all(uploadPromises);
            return results.map(result => result.payload);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Multiple upload failed');
        }
    }
);

// Upload image with check sheet ID
export const uploadImageForCheckSheet = createAsyncThunk(
    'file/uploadImageForCheckSheet',
    async ({ file, checkSheetId }: { file: File; checkSheetId: string }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('checkSheetId', checkSheetId);

            const response = await fetch(`${API_ROUTES.file.uploadImage}/check-sheet`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result as UploadImageResponse;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Upload failed');
        }
    }
);

// Middle function for uploading image (following existing pattern)
export const MiddleUploadImage = (file?: File) => {
    return async function (dispatch: any) {
        try {
            if (!file) {
                throw new Error('No file provided');
            }
            const action = await dispatch(uploadImage(file));
            return action.payload;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };
};