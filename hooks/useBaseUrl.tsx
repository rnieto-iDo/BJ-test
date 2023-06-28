import { useRouter } from "next/router";

export const useBaseUrl = () => {
    const router = useRouter();
    const baseUrl = process.browser
        ? `${window.location.protocol}//${window.location.host}${router.basePath}`
        : "";

    return baseUrl;
};
