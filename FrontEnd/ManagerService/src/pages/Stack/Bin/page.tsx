import { useState } from "react";
import {Input} from "@heroui/input";
import {Card} from "@heroui/react";
import {useSearchParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {StacksSelector} from "@/Store/Selector.tsx";
import {StackType} from "@/Store/StackSlice.tsx";

export default function StackDetailPage() {
    const [searchParams]=useSearchParams()
    const stackId = searchParams.get("stackId");
    const StackDisplay=useSelector(StacksSelector).find((el)=>el.stackId===stackId);
    console.log(StackDisplay)
    const [stackInfo, setStackInfo] = useState<StackType>(StackDisplay);


    const handleChange = (key, value) => {
        setStackInfo((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 sm:p-2 lg:p-4 grid grid-cols-10 gap-6">
            {/* LEFT SIDE: Stack Info & Bins */}
            <div className="col-span-4 dark:bg-gray-800 p-1 flex flex-col gap-3 rounded-xl">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Stack Information</h2>
                    <div className="space-y-4">
                        <Input
                            label="Stack Name"
                            value={stackInfo.stackName}
                            onChange={(e) => handleChange("stackName", e.target.value)}
                        />
                        <Input
                            label="Description"
                            value={stackInfo.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Bin Layout</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {stackInfo?.bin?.map((bin) => (
                            <div
                                key={bin?.binId}
                                className={`w-14 h-14 rounded-md cursor-pointer ${
                                    bin.status !== "EMPTY" ? "bg-yellow-400" : "bg-yellow-100"
                                }`}
                            ></div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <span className="inline-block w-4 h-4 bg-yellow-400 rounded mr-2"></span> Full Bin
                        <span className="inline-block w-4 h-4 bg-yellow-100 rounded ml-4 mr-2"></span> Empty Bin
                    </div>
                </Card>
            </div>

            {/* RIGHT SIDE: Empty */}
            <div className="col-span-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                {/* Reserved for future content */}
            </div>
        </div>
    );
}
