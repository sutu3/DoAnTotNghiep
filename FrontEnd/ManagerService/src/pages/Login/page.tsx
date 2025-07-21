"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
import {getUserRoleFromToken} from "@/Utils/auth.ts";

export default function LoginPage() {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch(API_ROUTES.Authen.Authen().login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Đăng nhập thất bại");
            }

            console.log("Đăng nhập thành công:", data);

            // 🔒 Lưu token nếu có
            localStorage.setItem("token", data.result?.token || "");
            const role =await getUserRoleFromToken();
            console.log(role)
            role == "manager" ? window.location.href = "/admin" : window.location.href = "/staff/tasks";
            // 🔁 Redirect sang dashboard hoặc trang chính

        } catch (error: any) {
            console.error("Lỗi khi đăng nhập:", error.message);
            alert("Đăng nhập thất bại: " + error.message);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background - Light Theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50">
                {/* Floating warehouse icons */}
                <div className="absolute inset-0 opacity-20">
                    <div className="animate-float-slow absolute top-20 left-10">
                        <Icon icon="mdi:warehouse" className="text-6xl text-gray-700" />
                    </div>
                    <div className="animate-float-medium absolute top-40 right-20">
                        <Icon icon="mdi:forklift" className="text-5xl text-blue-600" />
                    </div>
                    <div className="animate-float-fast absolute bottom-32 left-1/4">
                        <Icon icon="mdi:package-variant" className="text-4xl text-gray-600" />
                    </div>
                    <div className="animate-float-slow absolute bottom-20 right-1/3">
                        <Icon icon="mdi:truck-delivery" className="text-5xl text-blue-500" />
                    </div>
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-12 gap-4 h-full">
                        {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className="border border-gray-300/30"></div>
                        ))}
                    </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 via-transparent to-blue-50/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    {/* Header với warehouse theme */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                <Icon
                                    icon="mdi:warehouse"
                                    className="text-5xl text-blue-600 mr-2 drop-shadow-lg"
                                />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">
                                Warehouse Manager
                            </h1>
                        </div>
                        <p className="text-gray-600 text-lg">
                            Quản lý kho hàng thông minh
                        </p>
                    </div>

                    {/* Login Card với light glassmorphism effect */}
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md border border-gray-200">
                        <CardBody className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Đăng Nhập
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Truy cập vào hệ thống quản lý kho
                                </p>
                            </div>

                            <Form className="flex flex-col gap-6" validationBehavior="native" onSubmit={handleSubmit}>
                                <Input
                                    isRequired
                                    label="Email"
                                    labelPlacement="outside"
                                    name="email"
                                    placeholder="Nhập email của bạn"
                                    type="email"
                                    variant="bordered"
                                    startContent={
                                        <Icon
                                            icon="mdi:email-outline"
                                            className="text-blue-600 text-xl"
                                        />
                                    }
                                    classNames={{
                                        input: "text-gray-800 placeholder:text-gray-500",
                                        label: "text-gray-700 font-medium",
                                        inputWrapper: "border-gray-300 bg-white/80 hover:border-blue-500 focus-within:border-blue-500"
                                    }}
                                />

                                <Input
                                    isRequired
                                    label="Mật khẩu"
                                    labelPlacement="outside"
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    type={isVisible ? "text" : "password"}
                                    variant="bordered"
                                    startContent={
                                        <Icon
                                            icon="mdi:lock-outline"
                                            className="text-blue-600 text-xl"
                                        />
                                    }
                                    endContent={
                                        <button
                                            type="button"
                                            onClick={toggleVisibility}
                                            className="focus:outline-none"
                                        >
                                            <Icon
                                                icon={isVisible ? "mdi:eye-off" : "mdi:eye"}
                                                className="text-blue-600 hover:text-blue-700 text-xl transition-colors"
                                            />
                                        </button>
                                    }
                                    classNames={{
                                        input: "text-gray-800 placeholder:text-gray-500",
                                        label: "text-gray-700 font-medium",
                                        inputWrapper: "border-gray-300 bg-white/80 hover:border-blue-500 focus-within:border-blue-500"
                                    }}
                                />

                                <div className="flex items-center justify-between">
                                    <Checkbox
                                        defaultSelected
                                        name="remember"
                                        size="sm"
                                        classNames={{
                                            label: "text-gray-600 text-sm"
                                        }}
                                    >
                                        Ghi nhớ đăng nhập
                                    </Checkbox>
                                    <Link
                                        href="#"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    startContent={
                                        <Icon icon="mdi:login" className="text-xl" />
                                    }
                                >
                                    Đăng Nhập Hệ Thống
                                </Button>
                            </Form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:shield-check" className="text-green-500" />
                                        <span>Bảo mật</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:clock-outline" className="text-blue-500" />
                                        <span>24/7</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:database" className="text-purple-500" />
                                        <span>Đồng bộ</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            © 2024 Warehouse Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}