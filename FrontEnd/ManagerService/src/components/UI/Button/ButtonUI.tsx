import { Button } from "@heroui/react";
import React from "react";
interface ButtonProps {
  label: string;
  loading: boolean;
  onClick?: () => void;
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  className?: string;
}
const ButtonUI = ({
  label,
  loading,
  onClick,
  endContent,
  startContent,
  className,
}: ButtonProps) => {
  return (
    <Button
      aria-labelledby="Button"
      className={className}
      endContent={endContent}
      isLoading={loading}
      radius="lg"
      startContent={startContent}
      onPress={onClick}
    >
      {label}
    </Button>
  );
};

export default ButtonUI;
