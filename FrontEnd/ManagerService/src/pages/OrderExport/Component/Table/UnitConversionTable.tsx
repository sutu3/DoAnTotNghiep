import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import {Unit} from "@/Store/Unit.tsx";

interface UnitConversionTableProps {
    conversions: Unit[];
    baseQuantity: number;
    baseUnit: Unit|null;
    onUnitSelect?: (unit: Unit) => void; // Thêm callback
    selectedUnit?: Unit|null; // Thêm unit đã chọn
}

export default function UnitConversionTable({
                                                conversions,
                                                baseUnit,
                                                selectedUnit,
                                                onUnitSelect
                                            }: UnitConversionTableProps) {

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Icon icon="mdi:swap-horizontal" className="text-xl text-blue-600" />
                <h4 className="font-semibold">Bảng Quy Đổi Đơn Vị</h4>
            </div>

            <Card className="bg-blue-50 border-blue-200">
                <CardBody className="p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Số lượng cơ sở</p>
                        <p className="text-2xl font-bold text-blue-600">
                             1 {baseUnit?.unitName}
                        </p>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {baseUnit&&conversions.filter((el:Unit)=>el.ratioToBase>=baseUnit?.ratioToBase).map((conversion) => (
                    <Card
                        key={conversion.unitID}
                        className={`border hover:shadow-md transition-shadow cursor-pointer ${
                            selectedUnit?.unitID === conversion.unitID ? 'ring-2 ring-primary bg-primary-50' : ''
                        }`}
                        isPressable
                        onPress={() => onUnitSelect?.(conversion)}
                    >
                        <CardBody className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{conversion.unitName}</p>
                                    <p className="text-sm text-gray-500">
                                        1 {baseUnit?.unitName} = {(baseUnit?.ratioToBase && conversion.ratioToBase)
                                        ? (baseUnit.ratioToBase / conversion.ratioToBase).toFixed(3)
                                        : 'N/A'} {conversion.unitName}
                                    </p>

                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                        {(conversion.ratioToBase).toFixed(3)}
                                    </p>
                                    <p className="text-xs text-gray-500">{conversion.unitName}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}