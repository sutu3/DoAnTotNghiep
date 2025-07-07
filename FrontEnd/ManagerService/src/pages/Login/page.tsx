"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function LoginPage() {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("handleSubmit");
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-slate-900">
                {/* Floating warehouse icons */}
                <div className="absolute inset-0 opacity-10">
                    <div className="animate-float-slow absolute top-20 left-10">
                        <Icon icon="mdi:warehouse" className="text-6xl text-white" />
                    </div>
                    <div className="animate-float-medium absolute top-40 right-20">
                        <Icon icon="mdi:forklift" className="text-5xl text-blue-300" />
                    </div>
                    <div className="animate-float-fast absolute bottom-32 left-1/4">
                        <Icon icon="mdi:package-variant" className="text-4xl text-gray-300" />
                    </div>
                    <div className="animate-float-slow absolute bottom-20 right-1/3">
                        <Icon icon="mdi:truck-delivery" className="text-5xl text-blue-200" />
                    </div>
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div className="grid grid-cols-12 gap-4 h-full">
                        {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className="border border-white/20"></div>
                        ))}
                    </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
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
                                    className="text-5xl text-blue-400 mr-2 drop-shadow-lg"
                                />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                                Warehouse Manager
                            </h1>
                        </div>
                        <p className="text-blue-200 text-lg">
                            Quản lý kho hàng thông minh
                        </p>
                    </div>

                    {/* Login Card với glassmorphism effect */}
                    <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md border border-white/20">
                        <CardBody className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    Đăng Nhập
                                </h2>
                                <p className="text-blue-200 text-sm">
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
                                            className="text-blue-300 text-xl"
                                        />
                                    }
                                    classNames={{
                                        input: "text-white placeholder:text-gray-300",
                                        label: "text-blue-200 font-medium",
                                        inputWrapper: "border-white/30 bg-white/5 hover:border-blue-400 focus-within:border-blue-400"
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
                                            className="text-blue-300 text-xl"
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
                                                className="text-blue-300 hover:text-blue-200 text-xl transition-colors"
                                            />
                                        </button>
                                    }
                                    classNames={{
                                        input: "text-white placeholder:text-gray-300",
                                        label: "text-blue-200 font-medium",
                                        inputWrapper: "border-white/30 bg-white/5 hover:border-blue-400 focus-within:border-blue-400"
                                    }}
                                />

                                <div className="flex items-center justify-between">
                                    <Checkbox
                                        defaultSelected
                                        name="remember"
                                        size="sm"
                                        classNames={{
                                            label: "text-blue-200 text-sm"
                                        }}
                                    >
                                        Ghi nhớ đăng nhập
                                    </Checkbox>
                                    <Link
                                        href="#"
                                        size="sm"
                                        className="text-blue-300 hover:text-blue-200"
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
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:shield-check" className="text-green-400" />
                                        <span>Bảo mật</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:clock-outline" className="text-blue-400" />
                                        <span>24/7</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:database" className="text-purple-400" />
                                        <span>Đồng bộ</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-blue-300">
                            © 2024 Warehouse Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}