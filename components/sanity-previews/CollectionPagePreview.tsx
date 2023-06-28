import { Breadcrumb, Card, SectionFootnote, SectionHeader, WittLink } from '@witt-team/athens-component-library';
import cs from 'classnames';
import React, { FC } from 'react';

import { individualCollectionContentQuery } from '../../api/queries/pages.queries';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/Collection.module.scss';
import HeroImage from '../reusable/HeroImage/HeroImage';
import VideoPlayer from '../reusable/VideoPlayer/VideoPlayer';

type CollectionPagePreviewProps = {
    slug: string | string[];
};

const CollectionPagePreview: FC<CollectionPagePreviewProps> = ({ slug }) => {
    const cmsData = usePreview(null, individualCollectionContentQuery(slug));
    const breadcrumbs = useBreadcrumbs();

    return (
        <div className={cs(styles.Collection)}>
            <HeroImage
                className={styles.PageCover}
                backgroundImage={cmsData?.cover?.image}
                title={cmsData?.cover?.title}
                additionalText={cmsData?.cover?.additionalText}
                additionalTextLink={cmsData?.additionalTextUrl}
            />

            <div className={cs('witt-container')}>
                <Breadcrumb items={breadcrumbs} />
            </div>

            <div className={cs('witt-container', styles.MainTitle)}>
                <div className={styles.MainTitleText}>{cmsData?.mainTitle}</div>
                <SectionFootnote size="large" className={styles.MainTitleLink}>
                    <WittLink active href={cmsData?.mainTitleLink?.url ?? ''}>
                        {cmsData?.mainTitleLink?.text}
                    </WittLink>
                </SectionFootnote>
            </div>

            <div className={styles.MainProduct}>
                <Card
                    className={cs(styles.CardWithoutOverflow, styles.CardTextWithMargin)}
                    imageUrl={cmsData?.mainProduct?.image}
                    title={cmsData?.mainProduct?.title}
                    description={cmsData?.mainProduct?.description}
                    textLayout="horizontal"
                />
            </div>

            <div className="container-with-separator" />
            <div className="witt-container">
                <SectionHeader text={cmsData?.productStory?.title} />
            </div>

            <div className={styles.ProductStory}>
                {cmsData?.productStory?.productImages.map((productImage: any, index: number) => (
                    <Card
                        key={`product-story-${productImage?.id || productImage?.image}`}
                        className={cs(styles[`ProductImage-${index}`])}
                        imageUrl={productImage?.image}
                        title={productImage?.title ?? ''}
                        description={productImage?.description ?? ''}
                        textLayout="horizontal"
                    />
                ))}
            </div>

            <div className="witt-container">
                <div className={styles.TextSection}>
                    <div className={cs(styles.GridItem_0, styles.LargeText)}>{cmsData?.productStory?.textSection?.largeText}</div>
                    <div className={cs(styles.GridItem_1, styles.SmallTexts)}>
                        <p className={styles.FirstParagraph}>{cmsData?.productStory?.textSection?.firstParagraph}</p>
                        <p className={styles.SecondParagraph}>{cmsData?.productStory?.textSection?.secondParagraph}</p>
                    </div>
                    <div className={cs(styles.GridItem_2, styles.AdjecentSection)}>
                        <Card
                            className={cs(styles.CardWithoutOverflow)}
                            imageUrl={cmsData?.productStory?.adjecentSection?.bonusProduct?.image}
                            title={cmsData?.productStory?.adjecentSection?.bonusProduct?.title}
                            description={cmsData?.productStory?.adjecentSection?.bonusProduct?.description}
                            textLayout="horizontal"
                        />
                    </div>
                    <div className={cs(styles.GridItem_3, styles.AdjecentSectionText)}>
                        <p className={styles.AdjecentSectionTextTitle}>{cmsData?.productStory?.adjecentSection?.title}</p>
                        <p className={styles.AdjecentSectionTextDescirption}>{cmsData?.productStory?.adjecentSection?.description}</p>
                    </div>
                </div>
            </div>

            {/* STOPED HERE - REPLACE THIS PLACEHOLDER IMAGE WITH ACUTALL VIDEO COMPONENT */}
            <div className={styles.Animation}>
                <VideoPlayer playbackId={cmsData?.videoUrl} className={styles.VideoSection} autoPlay={false} />
            </div>
            <div className="container-with-separator">
                <span />
            </div>

            <div className="container-with-separator">
                <SectionHeader text={cmsData?.featuredProducts?.title} />
                <div className={styles.FeaturedProductsGrid}>
                    {cmsData?.featuredProducts?.products.map((product: any, index: number) => (
                        <Card key={`featured-products-${product.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={product?.image} title={product?.title} />
                    )) ?? []}
                </div>
            </div>

            <div className={cs('witt-container')}>
                <div className={cs('on-section-header', styles.AuthorSectionHeaderBlock)}>
                    <div className="header-text large">{cmsData?.aboutDesigner?.title}</div>
                </div>
            </div>

            <div className={cs('witt-container', styles.AboutDesigner)}>
                <div className={styles.Column}>
                    <div className={styles.AboutDesignerDescirptionWrapper}>
                        <div className={cs('on-section-header', styles.AuthorSectionHeader)}>
                            <div className="header-text large">{cmsData?.aboutDesigner?.title}</div>
                        </div>
                        <p className={styles.AboutDesignerText}>{cmsData?.aboutDesigner?.description}</p>
                        <WittLink className={styles.AboutDesignerLink} active href={cmsData?.aboutDesigner?.link?.url ?? ''}>
                            {cmsData?.aboutDesigner?.link?.text}
                        </WittLink>
                    </div>
                </div>
                <div className={styles.Column}>
                    <Card
                        className={cs(styles.CardWithoutOverflow)}
                        imageUrl={cmsData?.aboutDesigner?.designer?.image}
                        title={cmsData?.aboutDesigner?.designer?.title}
                        description={cmsData?.aboutDesigner?.designer?.description}
                        textLayout="horizontal"
                    />
                </div>
            </div>

            <div className="container-with-separator" />

            <div className={cs('witt-container')}>
                <SectionHeader text={cmsData?.exploreMore?.title} />
                <div className={cs(styles.ExploreMoreGrid)}>
                    {cmsData?.exploreMore?.products.map((product: any, index: number) => (
                        <Card key={`explore-more-${product?.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={product?.image} title={product?.title} />
                    )) ?? []}
                </div>
            </div>
        </div>
    );
};

export default CollectionPagePreview;
