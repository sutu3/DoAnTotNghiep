import { API_ROUTES } from "@/Api/UrlApi";
import { callApiThunk } from "@/Store/Store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export const ForgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, { rejectWithValue }) =>
        await callApiThunk(
            "POST",
            API_ROUTES.Authen.Authen().forgotPassword,
            { email },
            rejectWithValue
        )
);

export const ResetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (
        { userId, newPassword }: { userId: string; newPassword: string },
        { rejectWithValue }
    ) =>
        await callApiThunk(
            "PUT",
            API_ROUTES.Authen.Authen().resetPassword,
            { userId, newPassword },
            rejectWithValue
        )
);

export const MiddleForgotPassword = (email: string) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(ForgotPassword(email));
            localStorage.setItem("resetToken", action.payload.result?.token || "");

            showToast({
                title: "Email đã được gửi",
                description: `Vui lòng kiểm tra email ${email} để đặt lại mật khẩu`,
                color: "success",
            });

            return action.payload.result;
        } catch (error: any) {
            showToast({
                title: "Lỗi gửi email",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
            throw error;
        }
    };
};

export const MiddleResetPassword = (data: { userId: string; newPassword: string }) => {
    return async function (dispatch: any) {
        try {
            const action = await dispatch(ResetPassword(data));
            localStorage.setItem("token", action.payload.result?.token || "");
            localStorage.removeItem("resetToken");
            showToast({
                title: "Đặt lại mật khẩu thành công",
                description: "Mật khẩu của bạn đã được cập nhật",
                color: "success",
            });

            return action.payload.result;
        } catch (error: any) {
            showToast({
                title: "Lỗi đặt lại mật khẩu",
                description: `Message: ${error.message || error}`,
                color: "danger",
            });
            throw error;
        }
    };
};