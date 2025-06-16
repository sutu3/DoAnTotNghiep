import {Tooltip} from "@heroui/react";

interface Props {
    children: React.ReactNode;
    content: React.ReactNode;
}
const ToolTipUI=({  children, content }: Props)=> {
    return (
        <Tooltip
            showArrow
            classNames={{
                base: [
                    // arrow color
                    "before:bg-neutral-400 dark:before:bg-white",
                ],
                content: [" dark:bg-neutral-400 dark:bg-white", ""],
            }}
            content={content}
            placement="right"
        >
            {children}
        </Tooltip>
    );
}
export default ToolTipUI;
