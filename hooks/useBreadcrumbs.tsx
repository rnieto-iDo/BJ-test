import { useRouter } from 'next/router';
import { FC } from 'react';
import { removeQueryParams } from '../utils';
import { useBaseUrl } from './useBaseUrl';

export type Breadcrumb = {
    id: string;
    element: string;
    onClick: () => void;
};

type BreadcrumbSegmentOverride = {
    index: number;
    path: string;
}

//segmentPaths - method to override breadcrumb default behaviour - you can specify different path for certain segment
const useBreadcrumbs = (segmentPaths? : BreadcrumbSegmentOverride[]): Breadcrumb[] => {
    const router = useRouter();
    const baseUrl = useBaseUrl();
    const { query, asPath } = router;
    const clearedAsPath = removeQueryParams(asPath, baseUrl);
    const segments = clearedAsPath.split('/').filter(Boolean);

    const createBreadcrumb = (segment: string, index: number) => {
        const isParam = segment.startsWith('[');
        const param = isParam ? segment.substring(1, segment.length - 1) : null;
        let to = `/${segments.slice(0, index + 1).join('/')}`;

        if(segmentPaths){
            segmentPaths.forEach(sp =>{
                if(sp.index === index){
                    to = sp.path;
                }
            })
        }

        const resolvedParam = param || '';
        const element =
            isParam && resolvedParam in query
                ? query[resolvedParam] || ''
                : !Array.isArray(segment)
                ? segment
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
                      .join(' ')
                : '';

        return {
            id: `crumb-${index}`,
            element: element.toString(),
            onClick: () => router.push({ pathname: to }),
        };
    };

    return [
        {
            id: 'crumb-head',
            element: 'Home',
            onClick: () => router.push({ pathname: '/' }),
        },
        ...segments.map(createBreadcrumb),
    ];
};

export default useBreadcrumbs;
