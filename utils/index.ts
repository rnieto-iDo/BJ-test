import ReactDOMServer from 'react-dom/server';

export const removeQueryParams = (url: string, baseUrl: string): string => {
    try {
        const urlObj = new URL(url, baseUrl);
        urlObj.search = '';
        return urlObj.pathname;
    } catch (error) {
        return url;
    }
};

export const transformDateFormat = (dateString: string): string => {
    if(!dateString){
        return '';
    }

    const dateParts = dateString.split('-');
    const year = dateParts && dateParts.length > 0 ? dateParts[0] : '';
    const month =  dateParts && dateParts.length >= 2 ? dateParts[1] : '';
    const day = dateParts && dateParts.length >= 3 ? dateParts[2] : '';
    const transformedDate = `${day}.${month}.${year}`;
    return transformedDate;
};

export const generateEndpointFromQuery = (queryArray: string[] | undefined) => (queryArray ? `/${queryArray.join('/')}` : '/');

export const getKey = function getKey(id: number | string | undefined) {
    return id + (Math.random() + 1).toString(36).substring(7);
};

export const generateServerSideImageLink = (imageUrl: string) => {
    const width = 640;
    const quality = 75;

    const params = new URLSearchParams({
        url: imageUrl,
        w: width.toString(),
        q: quality.toString(),
    });

    return `${window.location.origin}/_next/image?${params.toString()}`;
};

export function encodeSvg(reactElement) {
    return `data:image/svg+xml, ${escape(ReactDOMServer.renderToStaticMarkup(reactElement))}`;
}
