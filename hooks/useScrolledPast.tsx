import { useState, useEffect } from "react";

const useScrolledPast = (elementId: string): boolean => {
    const [hasScrolledPast, setHasScrolledPast] = useState(false);

    useEffect(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === false) {
                    setHasScrolledPast(true);
                } else {
                    setHasScrolledPast(false);
                }
            });
        });

        observer.observe(element);

        // eslint-disable-next-line consistent-return
        return () => observer.disconnect();
    }, [elementId]);

    return hasScrolledPast;
};

export default useScrolledPast;
