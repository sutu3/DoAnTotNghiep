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
                                             trigger,
                                             title = "Modal Title",
                                             children,
                                             footer,
                                             draggable = true,
                                         }) => {
    const disclosure = useDisclosure();
    const isControlled = isOpenProp !== undefined;

    const isOpen = isControlled ? isOpenProp : disclosure.isOpen;
    const onOpen = isControlled ? () => onOpenChangeProp?.(true) : disclosure.onOpen;
    const onOpenChange = isControlled ? onOpenChangeProp! : disclosure.onOpenChange;

    const targetRef = React.useRef(null);
    const { moveProps } = useDraggable({ targetRef, isDisabled: !draggable || !isOpen });

    return (
        <>

            <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader {...moveProps} className="flex flex-col gap-1">
                                {title}
                            </ModalHeader>
                            <ModalBody>{children}</ModalBody>
                            <ModalFooter>
                                {footer || (
                                    <>
                                        <Button variant="light" onPress={onClose}>Close</Button>
                                        <Button color="primary" onPress={onClose}>OK</Button>
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
