import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    useDraggable,
} from "@heroui/react";

interface ModalUIProps {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    trigger?: React.ReactNode;
    title?: React.ReactNode;
    children?: React.ReactNode; // ModalBody content
    footer?: React.ReactNode;   // ModalFooter content
    draggable?: boolean;
}

const ModalUI: React.FC<ModalUIProps> = ({
                                             isOpen: isOpenProp,
                                             onOpenChange: onOpenChangeProp,
                                             title = "Modal Title",
                                             children,
                                             footer,
                                             draggable = true,
                                         }) => {
    const disclosure = useDisclosure();
    const isControlled = isOpenProp !== undefined;

    const isOpen = isControlled ? isOpenProp : disclosure.isOpen;
    const onOpenChange = isControlled ? onOpenChangeProp! : disclosure.onOpenChange;

    const targetRef = React.useRef(null);
    const { moveProps } = useDraggable({ targetRef, isDisabled: !draggable || !isOpen });

    return (
        <>

            <Modal
                ref={targetRef}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-black/30 backdrop-blur-sm",
                }}
            >
                <ModalContent className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl">
                    {(onClose) => (
                        <>
                            <ModalHeader
                                {...moveProps}
                                className="flex flex-col gap-1 bg-gradient-to-r from-indigo-200 via-purple-300 rounded-xl  to-pink-200 text-white rounded-t-2xl px-6 py-4"
                            >
                                <h3 className="text-lg font-semibold">{title}</h3>
                            </ModalHeader>

                            <ModalBody className="px-6 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                                {children}
                            </ModalBody>

                            <ModalFooter className="bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
                                {footer || (
                                    <>
                                        <Button variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            OK
                                        </Button>
                                    </>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalUI;
