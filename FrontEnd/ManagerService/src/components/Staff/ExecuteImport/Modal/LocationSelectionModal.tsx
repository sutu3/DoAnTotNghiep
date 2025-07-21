import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import StackSelection from "@/components/Staff/ExecuteImport/Select/StackSelection.tsx";
import BinSelection from "@/components/Staff/ExecuteImport/Select/BinSelection.tsx";
import LocationConfirmButton from "@/components/Staff/ExecuteImport/Button/LocationConfirmButton.tsx";
import {MiddleGetAllStackList} from "@/Store/Thunk/StackThunk.tsx";
import {useDispatch, useSelector} from "react-redux";
import {StacksSelector} from "@/Store/Selector.tsx";

interface LocationSelectionModalProps {
    warehouse: string;
    isOpen: boolean;
    onClose: () => void;
    selectedItem: any;
    onConfirmLocation: (stackId: string, binId: string) => void;
    warehouseId: string;
}

export default function LocationSelectionModal({
    warehouse,
                                                   isOpen,
                                                   onClose,
                                                   selectedItem,
                                                   onConfirmLocation,
                                                   warehouseId
                                               }: LocationSelectionModalProps) {
    const stackBinData=useSelector(StacksSelector);
    const dispatch = useDispatch();
    const [selectedStack, setSelectedStack] = useState("");
    const [selectedBin, setSelectedBin] = useState("");

    useEffect(() => {
        if (isOpen && warehouseId) {
            const fetchData = async () => {
                await (dispatch as any)(MiddleGetAllStackList(warehouse));
            };
            fetchData();
        }
    }, [isOpen, warehouseId]);


    const handleStackSelect = (stackId: string) => {
        console.log(stackId);
        setSelectedStack(stackId);
        setSelectedBin("");
    };

    const handleConfirm = () => {
        onConfirmLocation(selectedStack, selectedBin);
        setSelectedStack("");
        setSelectedBin("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalContent>
                <ModalHeader>
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:warehouse" className="text-2xl text-blue-600" />
                        <div>
                            <h3 className="text-xl font-bold">Chọn Vị Trí Lưu Trữ</h3>
                            <p className="text-sm text-gray-600">{selectedItem?.productName}</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <StackSelection
                            stackBinData={stackBinData}
                            selectedStack={selectedStack}
                            onStackSelect={handleStackSelect}
                        />

                        <BinSelection
                            stackBinData={stackBinData}
                            selectedStack={selectedStack}
                            selectedBin={selectedBin}
                            onBinSelect={setSelectedBin}
                        />

                        <LocationConfirmButton
                            selectedStack={selectedStack}
                            selectedBin={selectedBin}
                            onConfirm={handleConfirm}
                            onCancel={() => {
                                setSelectedStack("");
                                setSelectedBin("");
                            }}
                        />
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}