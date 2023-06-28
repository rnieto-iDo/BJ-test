import { useEffect, useRef, useState } from "react";
import { INDEX_PAGE_NUMBER } from "../constants/api.consts";
import useDebounce from "./useDebounce";

const useInfiniteScroll = (
    fetchData: any,
    noMoreRecords: boolean,
    initialPage = INDEX_PAGE_NUMBER
): any => {
    const scrollableContentRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<number>(initialPage);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleScroll = useDebounce(() => {
        if (noMoreRecords) return;
        if (isLoading) return;
        const scrollableContent = scrollableContentRef.current;
        if (!scrollableContent) return;
        const { offsetTop, offsetHeight } = scrollableContent;
        const position = window.pageYOffset;
        const viewHeight = window.innerHeight;
        if (position >= offsetHeight + offsetTop - viewHeight - 20)
            setPage(prevPage => prevPage + 1);
    }, 200);

    const handlePageReset = () => {
        setPage(INDEX_PAGE_NUMBER);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        setIsLoading(true);
        const fetchPage = async () => {
            try {
                await fetchData(page);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
            }
        };
        fetchPage();
    }, [page, fetchData]);

    return { scrollableContentRef, isLoading, handlePageReset };
};

export default useInfiniteScroll;
