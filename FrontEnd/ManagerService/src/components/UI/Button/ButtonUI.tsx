import { Button } from "@heroui/react";
import React from "react";
interface ButtonProps {
  label: string;
  loading: boolean;
  onClick?: () => void;
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  className?: string;
  variant:"solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
  color?:"danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined
}
const ButtonUI = ({
  label,
  loading,
  onClick,
  endContent,
  startContent,
  className,
                    color="danger",
                    variant="solid",
}: ButtonProps) => {
  return (
    <Button
      aria-labelledby="Button"
      className={className}
      endContent={endContent}
      isLoading={loading}
      radius="md"
      variant={variant}
      color={color}
      startContent={startContent}
      onPress={onClick}
    >
      {label}
    </Button>
  );
};

export default ButtonUI;
