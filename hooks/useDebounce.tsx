import { useCallback, useRef } from "react";

const useDebounce = <T extends any[]>(
    callback: (...args: T) => void,
    delay: number
): ((...args: T) => void) => {
    // Timeout Id of the current setTimeout call. Used to cancel the last call.
    const timeoutId = useRef<number>();

    return useCallback(
        (...args: T) => {
            // Clear the previous setTimeout call.
            clearTimeout(timeoutId.current);
            // Set the new timeout Id and call the given callback function with the given delay.
            timeoutId.current = window.setTimeout(
                () => callback(...args),
                delay
            );
        },
        [callback, delay]
    );
};

export default useDebounce;
