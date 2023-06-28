import { useState, useEffect } from "react";

interface ScreenResolution {
    width: number;
    height: number;
}

const useScreenResolution = (): ScreenResolution => {
    const [screenResolution, setScreenResolution] = useState<ScreenResolution>({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenResolution({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return screenResolution;
};

export default useScreenResolution;
