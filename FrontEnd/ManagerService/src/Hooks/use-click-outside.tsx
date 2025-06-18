import { useEffect } from "react";

export const useClickOutside = (refs: unknown, callback: unknown) => {
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      // Đảm bảo refs là một mảng
      const refsArray = Array.isArray(refs) ? refs : [refs];

      // Kiểm tra xem tất cả các ref có chứa event target không
      const isOutside = refsArray.every(
        (ref: { current: { contains: (arg0: any) => any } }) =>
          !ref?.current?.contains(event.target),
      );

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
