
import {Card, Tooltip} from "@heroui/react";
import { Badge } from "@heroui/react";
import { Skeleton } from "@heroui/react";
import { useProductStore } from "@/zustand/Product.tsx";

const ProductThumbnail = () => {
    const { product } = useProductStore();

    // Hiển thị Skeleton cho toàn bộ card nếu product chưa được load hoặc rỗng
    if (!product || Object.keys(product).length === 0) {
        // Giả định chiều cao phù hợp cho skeleton card
        return (
            <Card className="w-full max-w-sm mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <Skeleton className="w-full h-56 bg-gray-200 dark:bg-gray-700" /> {/* Placeholder height */}
                <div className="p-5 space-y-4"> {/* Matching padding and space */}
                    <Skeleton className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="w-full h-10 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="w-full h-16 bg-gray-200 dark:bg-gray-700" />
                </div>
            </Card>
        );
    }

    // Destructuring và cung cấp giá trị mặc định phòng trường hợp dữ liệu thiếu
    const {
        urlImageProduct,
        productName = 'Unnamed Product', // Default value
        unit = 'pc', // Default unit
        description = 'No description provided.', // Default description
        sku = 'N/A', // Default SKU
        price = 0, // Default price
        supplier = 'N/A', // Default supplier
        category = 'Uncategorized' // Default category
    } = product;

    // Format price để đảm bảo luôn có 2 chữ số thập phân
    const formattedPrice = typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';


    return (
        <Card className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">

            {urlImageProduct ? (
                <img
                    src={urlImageProduct}
                    alt={productName}
                    className="w-full h-56 object-cover" // Increased height to h-56
                />
            ) : (
                <Skeleton className="w-full h-56 bg-gray-200 dark:bg-gray-700" /> // Matching height
            )}

            {/* Product Details Area */}
            <div className="p-5 space-y-4">

                {/* Product Name and Price/Unit - Using Flexbox to place Price/Unit on the right */}
                <div className="flex items-start justify-between gap-2">
                    {/* Product Name: Larger, bolder text, flex-grow to take available space */}
                    <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-100 flex-grow">
                        {productName}
                    </h2>
                    {/* Price and Unit: Stacked and aligned to the end */}
                    <div className="flex flex-col items-end flex-shrink-0"> {/* flex-shrink-0 to prevent shrinking if name is very long */}
                        {/* Price: Prominent size and weight */}
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formattedPrice}</p>
                        {/* Unit Badge: Smaller text, positioned below price */}
                        <Badge variant="faded" className="text-xs px-1.5 py-0.5">{unit}</Badge> {/* Adjust badge size/padding */}
                    </div>
                </div>

                {/* Description: Text-sm, muted color for less emphasis */}
                <Tooltip content={description}>
                        <span className="w-[150px] text-sm leading-snug line-clamp-3 overflow-hidden">
                    {description}
                        </span>
                </Tooltip>


                {/* Other Details (SKU, Supplier, Category): Grid layout, smaller text, muted color */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 border-t pt-4 border-gray-200 dark:border-gray-700">
                    <div><strong>SKU:</strong> {sku}</div>
                    <div><strong>Supplier:</strong> {supplier}</div>
                    <div><strong>Category:</strong> {category}</div>
                    {/* Removed Price from grid as it's shown near the name */}
                </div>

            </div> {/* End Product Details Area */}

        </Card> // End Wrapper Card
    );
};

export default ProductThumbnail;