import React, { FC } from 'react';
import Head from 'next/head';

const DEFAULT_TITLE = "Brown Jordan"
const DEFAULT_DESCRIPTION = "Brown Jordan"

type SeoMetaDataProps = {
    // eslint-disable-next-line react/require-default-props
    title?: string;
    // eslint-disable-next-line react/require-default-props
    description?: string;
    // eslint-disable-next-line react/require-default-props
    keywords?: string;
};

const SeoMetaData: FC<SeoMetaDataProps> = ({ title, description, keywords }) => (
    <Head>
        <title>{title ?? DEFAULT_TITLE}</title>
        <meta name="description" content={description ?? DEFAULT_DESCRIPTION } key="meta-description" />
        {keywords && <meta name="keywords" content={keywords} key="meta-keywords" />}
    </Head>
);

export default SeoMetaData;