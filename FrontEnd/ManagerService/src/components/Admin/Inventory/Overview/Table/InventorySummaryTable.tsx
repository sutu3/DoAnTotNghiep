import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
// import { useSelector } from "react-redux";
// import { InventoryWarehouseSelector } from "@/Store/Selector.tsx";
import {Button} from "@heroui/button";

const InventorySummaryTable = () => {
    // const inventoryData = useSelector(InventoryWarehouseSelector);

    const topProducts = [
        {
            id: "1",
            name: "iPhone 14 Pro",
            category: "Electronics",
            quantity: 150,
            value: "$149,850",
            status: "In Stock",
            image: "/api/placeholder/40/40"
        },
        {
            id: "2",
            name: "Samsung Galaxy S23",
            category: "Electronics",
            quantity: 89,
            value: "$71,200",
            status: "Low Stock",
            image: "/api/placeholder/40/40"
        },
        {
            id: "3",
            name: "MacBook Air M2",
            category: "Electronics",
            quantity: 45,
            value: "$53,955",
            status: "In Stock",
            image: "/api/placeholder/40/40"
        },
        {
            id: "4",
            name: "AirPods Pro",
            category: "Electronics",
            quantity: 200,
            value: "$49,800",
            status: "In Stock",
            image: "/api/placeholder/40/40"
        },
        {
            id: "5",
            name: "iPad Pro",
            category: "Electronics",
            quantity: 12,
            value: "$13,188",
            status: "Critical",
            image: "/api/placeholder/40/40"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock": return "success";
            case "Low Stock": return "warning";
            case "Critical": return "danger";
            default: return "default";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Products by Value
                </h3>
                <Button variant="light" size="sm">
                    View All
                </Button>
            </div>

            <Table aria-label="Inventory summary table">
                <TableHeader>
                    <TableColumn>PRODUCT</TableColumn>
                    <TableColumn>CATEGORY</TableColumn>
                    <TableColumn>QUANTITY</TableColumn>
                    <TableColumn>VALUE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                    {topProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={product.image}
                                        size="sm"
                                        radius="sm"
                                    />
                                    <span className="font-medium">{product.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell className="font-medium">{product.value}</TableCell>
                            <TableCell>
                                <Chip
                                    color={getStatusColor(product.status)}
                                    size="sm"
                                    variant="flat"
                                >
                                    {product.status}
                                </Chip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default InventorySummaryTable;