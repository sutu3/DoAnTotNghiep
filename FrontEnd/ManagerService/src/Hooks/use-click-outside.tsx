import { useEffect } from "react";

export const useClickOutside = (refs: unknown, callback: unknown) => {
    useEffect(() => {
        const handleOutsideClick = (event: { target: any; }) => {
            // @ts-ignore
            const isOutside = refs.every((ref) => !ref?.current?.contains(event.target));

            if (isOutside && typeof callback === "function") {
                callback(event);
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [callback, refs]);
};
