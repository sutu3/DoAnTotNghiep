import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface LocationConfirmButtonProps {
    selectedStack: string;
    selectedBin: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LocationConfirmButton({
                                                  selectedStack,
                                                  selectedBin,
                                                  onConfirm,
                                                  onCancel
                                              }: LocationConfirmButtonProps) {
    if (!selectedStack || !selectedBin) return null;

    return (
        <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
                variant="light"
                onClick={onCancel}
            >
                Hủy
            </Button>
            <Button
                color="primary"
                onClick={onConfirm}
                startContent={<Icon icon="mdi:check" />}
            >
                Xác Nhận Vị Trí
            </Button>
        </div>
    );
}