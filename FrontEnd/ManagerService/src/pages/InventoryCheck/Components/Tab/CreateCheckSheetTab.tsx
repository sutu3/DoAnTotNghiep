import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {InventoryProductSelector} from "@/Store/Selector.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import {AdjustmentData, InventoryCheckCreate, InventoryCheckItem} from '../../Store/InventoryCheckSlice';
import CheckSheetProgressSteps from "@/pages/InventoryCheck/Step/CheckSheetProgressSteps.tsx";
import BasicInfoStep from '../../Step/BasicInfoStep';
import ProductSelectionStep from '../../Step/ProductSelectionStep';
import ConfirmationStep from '../../Step/ConfirmationStep';
import QuickActions from '../QuickActions';
import {InventoryProduct, InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";
import CheckSheetSummary from '../CheckSheetSummary';
import {MiddleGetAllInventoryProducts} from "@/Store/Thunk/InventoryOverviewThunk.tsx";
import {useInventoryCheckStore} from "@/zustand/InventoryCheck.tsx";
import {MiddleAddCheckInventorySheets} from "@/pages/InventoryCheck/Store/Thunk/InventoryCheckSheetThunk.tsx";


interface CreateCheckSheetTabProps {
    onBack: () => void;
    onSuccess: () => void;
}


const CreateCheckSheetTab: React.FC<CreateCheckSheetTabProps> = ({  onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [warehouse, setWarehouse] = useState("");
    const [checkSheetNumber, setCheckSheetNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<InventoryCheckItem[]>([]);
    const {items}=useInventoryCheckStore();
    const dispatch = useDispatch();
    const inventoryData:InventoryProduct[] = useSelector(InventoryProductSelector);

    useEffect(() => {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
        setCheckSheetNumber(`CS-${dateStr}-${timeStr}`);
    }, []);

    useEffect(() => {
        const fetchInventory = async () => {
            if (warehouse) {
                const page: pageApi = { pageNumber: 0, pageSize: 50 };
                await (dispatch as any)(MiddleGetAllInventoryProducts(warehouse, page));
            }
        };
        fetchInventory();
    }, [warehouse, dispatch]);

    const handleProductAdjustment = (adjustmentData: AdjustmentData, productId: string,inventoryWarehouse:InventoryWarehouse) => {
        const product = inventoryData.find((p:InventoryProduct) => p.productDetails?.productId === productId);
        if (!product) return;

        const newProduct: InventoryCheckItem = {
            ...product,
            systemQuantity: inventoryWarehouse?.quantity,
            actualQuantity: adjustmentData.quantity,
            difference: adjustmentData.quantity - inventoryWarehouse?.quantity,
            adjustmentReason: adjustmentData.reason,
            checkNotes: adjustmentData.notes,
            inventoryWarehouseId: inventoryWarehouse?.inventoryWarehouseId,
            binDetails: inventoryWarehouse?.binDetails,
            quantity: inventoryWarehouse?.quantity,
            inventoryProduct: product,
        };
        setSelectedProducts(prev => {
            const existing = prev.find(p => p.inventoryWarehouseId === productId);
            if (existing) {
                return prev.map(p => p.inventoryWarehouseId === productId ? newProduct : p);
            }
            return [...prev, newProduct];
        });
    };

    const handleCreateCheckSheet = async () => {
        try {
            const newSheetInventoryCheck:InventoryCheckCreate={
                checkSheetNumber: checkSheetNumber,
                warehouse: warehouse,
                notes: notes,
                checkDetails:items
            }
            await (dispatch as any)(MiddleAddCheckInventorySheets(newSheetInventoryCheck))
            onSuccess();
        } catch (error) {
            console.error("Error creating check sheet:", error);
        }
    };

    const resetForm = () => {
        setSelectedProducts([]);
        setNotes("");
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br ">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Progress Steps */}
                <CheckSheetProgressSteps currentStep={currentStep} />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="xl:col-span-3 space-y-6">
                        {currentStep === 1 && (
                            <BasicInfoStep
                                checkSheetNumber={checkSheetNumber}
                                setCheckSheetNumber={setCheckSheetNumber}
                                warehouse={warehouse}
                                setWarehouse={setWarehouse}
                                notes={notes}
                                setNotes={setNotes}
                                onNext={() => setCurrentStep(2)}
                                canProceed={warehouse !== "" && checkSheetNumber !== ""}
                            />
                        )}

                        {currentStep === 2 && (
                            <ProductSelectionStep
                                inventoryData={inventoryData}
                                selectedProducts={selectedProducts}
                                onProductAdjustment={handleProductAdjustment}
                                onNext={() => setCurrentStep(3)}
                                onPrev={() => setCurrentStep(1)}
                                canProceed={selectedProducts.length > 0}
                            />

                        )}

                        {currentStep === 2 && (
                            <ConfirmationStep
                                selectedProducts={selectedProducts}
                                setSelectedProducts={setSelectedProducts}
                                onPrev={() => setCurrentStep(2)}
                                onSubmit={handleCreateCheckSheet}
                                onProductAdjustment={handleProductAdjustment}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        <CheckSheetSummary
                            selectedProducts={selectedProducts}
                            checkSheetNumber={checkSheetNumber}
                        />
                        <QuickActions
                            onReset={resetForm}
                            selectedProducts={selectedProducts}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCheckSheetTab;