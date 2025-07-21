import { Card, CardBody } from "@heroui/react";
import { StackType } from "@/Store/StackSlice.tsx";

interface BinSelectionProps {
    stackBinData: StackType[];
    selectedStack: string;
    selectedBin: string;
    onBinSelect: (binId: string) => void;
}

export default function BinSelection({
                                         stackBinData,
                                         selectedStack,
                                         selectedBin,
                                         onBinSelect
                                     }: BinSelectionProps) {
    // Tìm stack được chọn và lấy bins
    const selectedStackData = stackBinData?.find(stack => stack.stackId === selectedStack);
    const availableBins = selectedStackData?.bin || [];

    if (!selectedStack) {
        return null; // Không hiển thị gì nếu chưa chọn stack
    }

    if (availableBins.length === 0) {
        return (
            <div>
                <h4 className="text-lg font-semibold mb-3">Chọn Bin</h4>
                <p className="text-gray-500">Không có bin nào trong stack này</p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="text-lg font-semibold mb-3">Chọn Bin</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableBins.map((bin) => ( bin.status!="AVAILABLE"&&
                    <Card
                        key={bin.binId}
                        className={`cursor-pointer transition-all ${
                            selectedBin === bin.binId
                                ? 'border-2 border-green-500 bg-green-50'
                                : 'hover:bg-gray-50'
                        }`}
                        isPressable
                        onPress={() => onBinSelect(bin.binId)}
                    >
                        <CardBody className="p-3">
                            <div className="text-center">
                                <h6 className="font-semibold">{bin.binCode}</h6>
                                <div className="text-xs text-gray-500 mt-1">
                                    <p>Capacity: {bin.capacity}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}