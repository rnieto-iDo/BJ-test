/* eslint-disable react/jsx-no-useless-fragment */
import React, { FC } from 'react';
import cs from 'classnames';
import Link from 'next/link';

import {SanityImage} from "../SanityImage/SanityImage";
import {getKey} from "../../../utils";


type DescriptiveSectionProps = {
    domID?: string;
    dataTestId?: string;
    className?: string;
    layout?: 'image-first' | 'text-first' | 'full-width-image';
    image: any;
    title: string;
    description: string;
    textPosition?: 'start' | 'end';
};

type DescriptiveSectionsType = {
    descriptiveSections: Array<DescriptiveSectionProps>;
};

const DescriptiveSections: FC<DescriptiveSectionsType> = ({ descriptiveSections }) => (
        <>
        {descriptiveSections?.map((item: any, index: number) => (
                // classname had some logic: {item.layout === 'full-width-image' ? '' : 'container-with-separator'} - removed by IV
                <div key={getKey(index)} 
                     className='container-with-separator'> 
                        <div id="descriptive-section" className={cs("on-descriptive-section", item?.layout, item?.textPosition)}>
                            <div className={cs("sanity-image-wrapper")}>
                                <Link href={item?.link?.url || '#'}>
                                    {item?.image?.asset ? <SanityImage image={item?.image} />: null}
                                </Link>
                            </div>
                            <div className="text">
                                <Link href={item?.link?.url || '#'}>
                                    <h2 className="title">{item?.title}</h2>
                                    <p className="description">{item?.description}</p>
                                </Link>
                            </div>
                        </div>
                        {item.layout === 'full-width-image' ? <div className="container-with-separator" /> : null}
                </div>
        )) ?? null}
        </>
);
export default DescriptiveSections;
