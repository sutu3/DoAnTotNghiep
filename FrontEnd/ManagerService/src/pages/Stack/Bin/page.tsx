import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { StacksSelector } from "@/Store/Selector.tsx";
import { StackType } from "@/Store/StackSlice.tsx";
import {PageHeader} from "@/components/Admin/Bin/PageHeader.tsx";
import {StackInfo} from "@/components/Admin/Bin/StackInfor.tsx";
import {BinGrid} from "@/components/Admin/Bin/BinGrid.tsx";
import {ProductList} from "@/components/Admin/Bin/ProductList.tsx";
import {updateStack} from "@/Store/Thunk/StackThunk.tsx";

export default function StackDetailPage() {
    const [searchParams] = useSearchParams();
    const stackId = searchParams.get("stackId");
    const stackDisplay = useSelector(StacksSelector).find((el: { stackId: string | null; }) => el.stackId == stackId);

    const [stackInfo, setStackInfo] = useState<StackType | null>(stackDisplay || null);
    const [selectedBinId, setSelectedBinId] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [originalStackInfo, setOriginalStackInfo] = useState<StackType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    // Set default selected bin to first bin
    useEffect(() => {
        if (stackInfo?.bin && stackInfo.bin.length > 0 && !selectedBinId) {
            setSelectedBinId(stackInfo.bin[0].binId);
        }
    }, [stackInfo, selectedBinId]);

    const handleStackChange = (key: string, value: string) => {
        if (!isEditing) return;
        setStackInfo((prev) => prev ? { ...prev, [key]: value } : null);
    };

    const handleBinSelect = (binId: string) => {
        setSelectedBinId(binId);
    };

    const handleToggleEdit = () => {
        if (!isEditing) {
            setOriginalStackInfo(stackInfo);
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            // TODO: Implement API call to save stack changes
            const fetch=async ()=>{
                setLoading(true)
                console.log("Saving stack changes:", stackInfo);
                (dispatch as any)(updateStack({
                    stackName: stackInfo?.stackName||"",
                    description: stackInfo?.description||"",
                    stackId: stackInfo?.stackId||""
                }));
                setLoading(true)
                setIsEditing(false);
                setOriginalStackInfo(null);
            }
            fetch()
        } catch (error) {
            console.error("Error saving stack:", error);
        }
    };

    const handleCancel = () => {
        setStackInfo(originalStackInfo);
        setIsEditing(false);
        setOriginalStackInfo(null);
    };

    const selectedBin = stackInfo?.bin?.find(bin => bin.binId === selectedBinId);

    if (!stackInfo) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Stack not found
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        The requested stack could not be found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <PageHeader
                    loading={loading}
                    stackName={stackInfo.stackName}
                    isEditing={isEditing}
                    onToggleEdit={handleToggleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT SIDE: Stack Info & Bins */}
                    <div className="lg:col-span-2 space-y-6">
                        <StackInfo
                            stack={stackInfo}
                            onStackChange={handleStackChange}
                            isEditable={isEditing}
                        />

                        <BinGrid
                            bins={stackInfo.bin || []}
                            selectedBinId={selectedBinId}
                            onBinSelect={handleBinSelect}
                        />
                    </div>

                    {/* RIGHT SIDE: Product List */}
                    <div className="lg:col-span-3">
                        <ProductList
                            selectedBinId={selectedBinId}
                            binCode={selectedBin?.binCode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}