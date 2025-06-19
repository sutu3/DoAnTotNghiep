import { useSelector } from "react-redux";

import ProgressStack from "@/pages/Dashboard/ProgressStask.tsx";
import StatCardAdmin from "@/components/Admin/StatCardAdmin.tsx";
import StatFilterAdmin from "@/components/Admin/StatFilterAdmin.tsx";
import Stack from "@/pages/Stack.tsx";
import { StacksSelector } from "@/Store/Selector.tsx";
import CardUI from "@/components/Admin/Dashboard/CardUI.tsx";

export default function WarehousePage() {
  const stacks = useSelector(StacksSelector);

  return (
    <div className="min-h-screen  bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex gap-4 p-4 rounded-lg">
        <StatCardAdmin mainValue="3432" subLabel="New Order" />
        <StatCardAdmin mainValue="$532k" rightValue="4125" subLabel="Sales" />
        <StatCardAdmin
          mainValue="2453"
          rightValue="1942"
          subLabel="Units Sold"
        />
        <StatCardAdmin mainValue="33(23%)" subLabel="Return Customers" />
        <StatFilterAdmin />

      </div>
      <div className="flex flex-row gap-2">
        {/* Left: Dashboard layout */}
        <div className="flex-1  p-4 rounded-xl">
          <Stack
            date="06/03/2025"
            sectionName="Section Overview"
            stacks={stacks}
          />
        </div>

        {/* Right: Circular progress */}
        <div className="w-80  rounded-xl text-white items-center justify-center">
          <div className="relative">
            <ProgressStack />
          </div>
        </div>
      </div>
    </div>
  );
}
