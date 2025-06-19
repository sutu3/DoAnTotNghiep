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
}

const ModalUI: React.FC<ModalUIProps> = ({
                                           isOpen: isOpenProp,
                                           onOpenChange: onOpenChangeProp,
                                           title = "Information", // More neutral default title
                                           children,
                                           footer,
                                           draggable = true, // Default to true
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
      // Fragment wrapper is okay here as Modal component handles its own portal/rendering
      <>
        {/*
        The actual Modal component from @heroui/react (or NextUI/other library)
        This component typically handles overlay (backdrop) and positioning
      */}
        <Modal
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
              className="relative rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden transform transition-all duration-300 ease-out opacity-100 translate-y-0 sm:scale-100" // Added transformative animation classes (adjust duration/ease)
          >
            {/* Function as children pattern provided by NextUI ModalContent */}
            {(onClose) => (
                <>
                  {/* Modal Header - Drag Handle */}
                  <ModalHeader
                      {...moveProps} // Apply drag properties to header
                      // Styling for the header
                      className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-sky-400 via-fuchsia-500 to-violet-600 text-white rounded-t-2xl cursor-grab active:cursor-grabbing" // Changed gradient, ensured justify-between/items-center, added cursor styles
                  >
                    <h3 className="text-xl font-bold text-shadow-md">{title}</h3> {/* Larger title, added text-shadow class (requires plugin or custom style) */}
                    {/* You might add a close button here if the modal library doesn't include one or if you want a custom one */}
                    {/*
                 <Button isIconOnly variant="light" size="sm" onPress={onClose} className="text-white/70 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                 </Button>
                 */}
                  </ModalHeader>

                  {/* Modal Body - Content Area */}
                  <ModalBody className="px-6 py-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 overflow-y-auto max-h-[60vh]"> {/* Increased vertical padding, added overflow-y and max-height */}
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