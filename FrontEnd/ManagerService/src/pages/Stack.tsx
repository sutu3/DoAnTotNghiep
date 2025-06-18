import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

import ToolTipUI from "@/components/UI/ToolTip/ToolTipUI.tsx";
import { StackType } from "@/Store/StackSlice.tsx";

type WarehouseSectionProps = {
  sectionName: string;
  date?: string;
  stacks: StackType[];
};
// interface BinEmpty {
//   binId: string;
//   binType: string;
// }
const MAX_BINS = 12;

const WarehouseSection: React.FC<WarehouseSectionProps> = ({
  sectionName,
  date,
  stacks,
}) => {
  return (
    <Card className="bg-white dark:bg-gray-900 rounded-xl text-gray-800 dark:text-gray-100 shadow-lg">
      {/* Header */}
      <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold p-2">{sectionName}</h2>
        {date && <span className="text-sm text-gray-500">{date}</span>}
      </CardHeader>

      {/* Body */}
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-3">
          {stacks.map((stack: StackType) => {
            const filledBins = [...stack.bin];
            const missingCount = MAX_BINS - filledBins.length;

            for (let i = 0; i < missingCount; i++) {
              filledBins.push({
                binId: `empty-${stack.stackId}-${i}`,
                status: "empty" as any,
                capacity: 0,
                binCode: "",
                createdAt: "",
                updatedAt: "",
                isDeleted: false,
                deletedAt: null,
              });
            }

            return (
              <div
                key={stack.stackId}
                className="grid grid-cols-4 gap-2 p-3 dark:bg-gray-800 min-w-max"
              >
                {filledBins.map((bin) => {
                  const isEmpty = bin.status === "empty";
                  const isFree = bin.status === "free";
                  const isLoaded = bin.status === "loaded";

                  if (isLoaded) {
                    return (
                      <ToolTipUI
                        key={bin.binId} // Giả định bin.id, row, size, deliveredAt có sẵn từ ngữ cảnh cha
                        content={
                          <div className="min-w-[180px] rounded-xl bg-gray-200 text-white shadow-lg p-4 flex items-center gap-4 border border-gray-700">
                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-3xl">
                              📦
                            </div>
                            <div className="flex flex-col flex-grow text-sm">
                              {/*<div className="font-bold text-base truncate">
                                                                {`Row ${row} #${bin.id}`}
                                                            </div>
                                                            <div className="text-gray-400 text-xs mb-1">
                                                                {`H${size.h} × W${size.w} × ${size.weight} KG`}
                                                            </div>
                                                            <div className="text-green-400 text-xs font-medium">
                                                                Delivered {deliveredAt}
                                                            </div>*/}
                            </div>
                          </div>
                        }
                      >
                        {/* Element này là cái bạn hover vào để tooltip xuất hiện */}
                        <div className="w-10 h-10 rounded-md border shadow-sm bg-yellow-400 hover:bg-yellow-500 cursor-pointer transition" />
                      </ToolTipUI>
                    );
                  }

                  // Render cho free & empty bin (simple tooltip or no tooltip)
                  return (
                    <ToolTipUI
                      key={bin.binId}
                      content={
                        isEmpty ? "Empty Bin" : `Free Bin - ${bin.binId}`
                      }
                    >
                      <div
                        className={`
                    w-10 h-10 rounded-md border shadow-sm
                    ${isFree ? "bg-yellow-50 border-gray-300" : ""}
                    ${isEmpty ? "bg-gray-200 border-gray-400" : ""}
                `}
                      />
                    </ToolTipUI>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardBody>

      {/* Legend */}
      <CardFooter className="flex gap-6 mt-1 text-sm">
        <LegendBox
          color="bg-yellow-50 border border-gray-300"
          label="Free Place"
        />
        <LegendBox color="bg-yellow-400" label="Loaded Place" />
        <LegendBox
          color="bg-gray-200 border border-gray-400"
          label="Empty Bin"
        />
      </CardFooter>
    </Card>
  );
};

type LegendProps = {
  color: string;
  label: string;
};

const LegendBox = ({ color, label }: LegendProps) => (
  <div className="flex items-center gap-2">
    <div className={`w-6 h-6 rounded-md ${color}`} />
    <span>{label}</span>
  </div>
);

export default WarehouseSection;
