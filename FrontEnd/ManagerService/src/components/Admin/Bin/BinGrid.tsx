import React from "react";
import { Card, Chip, Tooltip } from "@heroui/react";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import {Bin} from "@/Store/StackSlice.tsx";

interface BinGridProps {
    bins: Bin[];
    selectedBinId?: string;
    onBinSelect: (binId: string) => void;
}

export const BinGrid: React.FC<BinGridProps> = ({
                                                    bins,
                                                    selectedBinId,
                                                    onBinSelect
                                                }) => {
    const getBinStatusColor = (status?: "EMPTY"|"FULL"|"MAINTENANCE"|"AVAILABLE") => {
        switch (status) {
            case "EMPTY": return "bg-emerald-100 border-emerald-300 hover:bg-emerald-200";
            case "AVAILABLE": return "bg-blue-100 border-blue-300 hover:bg-blue-200";
            case "MAINTENANCE": return "bg-amber-100 border-amber-300 hover:bg-amber-200";
            default: return "bg-gray-100 border-gray-300 hover:bg-gray-200";
        }
    };

    const getBinStatusIcon = (status?: "EMPTY"|"FULL"|"MAINTENANCE"|"AVAILABLE") => {
        switch (status) {
            case "EMPTY": return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case "AVAILABLE": return <Package className="w-4 h-4 text-blue-600" />;
            case "MAINTENANCE": return <AlertTriangle className="w-4 h-4 text-amber-600" />;
            default: return null;
        }
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Bin Layout
                </h2>
                <Chip size="sm" variant="flat">
                    {bins?.length || 0} bins
                </Chip>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
                {bins?.map((bin) => (
                    <Tooltip
                        key={bin.binId}
                        content={
                            <div className="p-2">
                                <p className="font-medium">{bin.binCode}</p>
                                <p className="text-sm text-gray-500">Status: {bin.status}</p>
                                <p className="text-sm text-gray-500">Capacity: {bin.capacity}</p>
                            </div>
                        }
                    >
                        <div
                            className={`  
                relative w-16 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200  
                ${getBinStatusColor(bin.status)}  
                ${selectedBinId === bin.binId ? 'ring-2 ring-blue-500 ring-offset-2' : ''}  
              `}
                            onClick={() => onBinSelect(bin.binId)}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                {getBinStatusIcon(bin.status)}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 text-xs text-center p-1 bg-white/80 rounded-b-lg">
                                {bin.binCode}
                            </div>
                        </div>
                    </Tooltip>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                    <span>Empty</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                    <span>In Use</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                    <span>Maintenance</span>
                </div>
            </div>
        </Card>
    );
};