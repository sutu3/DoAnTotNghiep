// utils/toast.ts
import { addToast } from "@heroui/react";

export const showToast = ({
  title,
  description,
  color = "default",
}: {
  title: string;
  description: string;
  color?: string; // hoặc cụ thể "success" | "error" nếu biết rõ
}) => {
  // @ts-ignore
  addToast({
    hideIcon: true,
    title,
    description,
    timeout: 3000,
    classNames: {
      closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
    },
    closeIcon: (
      <svg
        fill="none"
        height="32"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="32"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
    // color (nếu thư viện hỗ trợ)
    ...(color && { color }),
  });
};
