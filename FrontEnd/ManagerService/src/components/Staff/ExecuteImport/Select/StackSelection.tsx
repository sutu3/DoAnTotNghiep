import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import {StackType} from "@/Store/StackSlice.tsx";

interface StackSelectionProps {
    stackBinData: StackType[];
    selectedStack: string;
    onStackSelect: (stackId: string) => void;
}

export default function StackSelection({ stackBinData, selectedStack, onStackSelect }: StackSelectionProps) {
    return (
        <div>
            <h4 className="text-lg font-semibold mb-3">Chọn Stack</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stackBinData?.map((stack) => (
                    <Card
                        key={stack.stackId}
                        className={`cursor-pointer transition-all ${
                            selectedStack === stack.stackId
                                ? 'border-2 border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                        }`}
                        onPress={() => onStackSelect(stack.stackId)}
                        isPressable
                    >

                    <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="font-semibold">{stack.stackName}</h5>
                                    <p className="text-sm text-gray-500">
                                        {stack.bin.length} bins
                                    </p>
                                </div>
                                <Icon
                                    icon="mdi:layers"
                                    className="text-2xl text-blue-600"
                                />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}