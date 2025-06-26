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
} from "@heroui/react"; // Make sure to replace "@heroui/react" with your actual library name if it's not correct

interface ModalUIProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  trigger?: React.ReactNode; // This prop seems unused in the current implementation
  title?: React.ReactNode;
  children?: React.ReactNode; // ModalBody content
  footer?: React.ReactNode; // ModalFooter content
  draggable?: boolean;
  size?: "sm" | "md" | "lg"|"xl"|"2xl"|"3xl";
}

const ModalUI: React.FC<ModalUIProps> = ({
                                           isOpen: isOpenProp,
                                           onOpenChange: onOpenChangeProp,
                                           title = "Information", // More neutral default title
                                           children,
                                           footer,
                                           draggable = true, // Default to true
    size = "md",
                                         }) => {
  const disclosure = useDisclosure();
  // Determine if the modal state is controlled externally
  const isControlled = isOpenProp !== undefined;

  // Use external props if controlled, otherwise use internal disclosure state
  const isOpen = isControlled ? isOpenProp : disclosure.isOpen;
  const onOpenChange = isControlled
      ? onOpenChangeProp!
      : disclosure.onOpenChange;

  const targetRef = React.useRef(null);
  // Hook for draggable functionality, requires the targetRef and checks draggable prop and isOpen state
  const { moveProps } = useDraggable({
    targetRef,
    isDisabled: !draggable || !isOpen, // Only enable drag if allowed by prop and modal is open
  });

  return (
      <>

        <Modal
            size={size}
            ref={targetRef} // Pass ref to the modal element for dragging
            // Customizing backdrop styling
            classNames={{
              backdrop: "bg-black/50 backdrop-blur-sm transition-opacity", // Darker backdrop with smooth transition
            }}
            isOpen={isOpen} // Control open/close state
            onOpenChange={onOpenChange} // Handle change events (like clicking outside or pressing Esc)
            // Potentially add `isDismissable={false}` if you don't want to close on outside click/esc
        >
          {/* Modal content area - styled container */}
            <ModalContent
                className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
            >
            {/* Function as children pattern provided by NextUI ModalContent */}
            {(onClose) => (
                <>
                  {/* Modal Header - Drag Handle */}
                    <ModalHeader
                        {...moveProps}
                        className="flex items-center px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-semibold text-lg border-b border-gray-200 dark:border-gray-700 cursor-move"
                  >
                      <div className="text-center">
                          <h1 className="text-3xl font-bold">{title} 👋</h1>
                      </div>

                  </ModalHeader>

                  {/* Modal Body - Content Area */}
                    <ModalBody className="px-5 py-5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 overflow-y-auto max-h-[60vh]"> {/* Increased vertical padding, added overflow-y and max-height */}
                    {children} {/* Render passed-in children */}
                  </ModalBody>

                  {/* Modal Footer - Actions Area */}
                  <ModalFooter className="flex justify-end px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
                    {/* Render passed-in footer content or default buttons */}
                    {footer || (
                        <>
                          {/* Default close button */}
                          <Button variant="light" onPress={onClose} className="text-gray-600 dark:text-gray-300 hover:underline"> {/* Adjusted default button styles */}
                            Close
                          </Button>
                          {/* Default OK button */}
                          <Button color="primary" onPress={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"> {/* More specific default button styles */}
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