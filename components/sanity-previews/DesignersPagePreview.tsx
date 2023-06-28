import { Card, ExploreSection, SectionFootnote, SectionHeader, WittLink, Breadcrumb as WittBreadCrumbs } from '@witt-team/athens-component-library';
import cs from 'classnames';
import { FC } from 'react';

import { discoverDesignersPageContentQuery } from '../../api/queries/pages.queries';
import { Breadcrumb } from '../../hooks/useBreadcrumbs';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/DiscoverDesigners.module.scss';
import HeroImage from '../reusable/HeroImage/HeroImage';
import Timeline from '../reusable/Timeline/Timeline';

type DesignersPagePreviewProps = {
    breadcrumbs: Breadcrumb[];
};

const DesignersPagePreview: FC<DesignersPagePreviewProps> = ({ breadcrumbs }) => {
    const cmsData = usePreview(null, discoverDesignersPageContentQuery);

    return (
        <div className={styles.Discover}>
            <HeroImage className={styles.PageCover} backgroundImage={cmsData?.cover?.image} title={cmsData?.cover?.title} additionalText={cmsData?.cover?.additionalText} />
            <WittBreadCrumbs className={cs('witt-container')} items={breadcrumbs} />
            <div className="container-with-separator">
                <div className={styles.MainTitle}>{cmsData?.description}</div>
            </div>

            <div className={cs('container-with-separator', styles.OurDesigners)}>
                <SectionHeader className={styles.SectionHeader} text={cmsData?.ourDesigners?.title} />

                <div className={styles.OurDesignersGrid}>
                    {cmsData?.ourDesigners?.designers.map((item: any) => (
                        <Card
                            key={`our-designers-${item?.id}`}
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            isImageVertical
                            textLayout="horizontal"
                            className={cs(styles.CardGridItem)}
                        />
                    )) ?? null}
                </div>
            </div>

            <div className={cs('witt-container', styles.FeaturedCollections)}>
                <SectionHeader text={cmsData?.featuredCollections?.title} />
                <Card
                    className={styles.FeaturedCollectionMain}
                    title={cmsData?.featuredCollections?.mainCollection?.title}
                    description={cmsData?.featuredCollections?.mainCollection?.description}
                    textLayout="horizontal"
                    imageUrl={cmsData?.featuredCollections?.mainCollection?.image}
                />

                <div className={styles.OtherCollections}>
                    {cmsData?.featuredCollections?.otherCollections.map((collection: any, index: number) => (
                        <Card
                            key={`other-collections-${collection?.id}`}
                            className={cs(styles[`Collection-${index}`])}
                            title={collection?.title}
                            description={collection?.description}
                            textLayout="horizontal"
                            imageUrl={collection?.image}
                        />
                    )) ?? []}
                </div>
            </div>

            <div className={cs('container-with-separator')}>
                <SectionHeader className={cs(styles.FeaturedCollectionsFootnoteDescription)} text={cmsData?.featuredCollections?.description} />
                <SectionFootnote size="medium" className={styles.FeaturedCollectionsFootnoteLink}>
                    <WittLink active href={cmsData?.featuredCollections?.footnoteLink?.url ?? ''}>
                        {cmsData?.featuredCollections?.footnoteLink?.text}
                    </WittLink>
                </SectionFootnote>
            </div>

            <div className={cs('container-with-separator', styles.FeaturedProducts)}>
                <SectionHeader text={cmsData?.featuredProducts?.title} />
                <div className={cs(styles.Grid)}>
                    {cmsData?.featuredProducts?.products.map((product: any, index: number) => (
                        <Card key={`featured-products-${product?.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={product?.image} title={product?.title} />
                    )) ?? []}
                </div>
            </div>

            <div className={cs('witt-container', styles.TimelineWrapper)}>
                <SectionHeader text={cmsData?.exploreMore?.title} className={styles.SectionHeader} />

                <Timeline />
            </div>

            <div className={cs('witt-container')}>
                <div className={cs(styles.MixedContent)}>
                    {cmsData?.exploreMore?.mixedContent.map((product: any, index: number) => (
                        <Card key={`mixed-content-${product.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={product?.image} title={product?.title} />
                    )) ?? []}
                </div>
            </div>

            <ExploreSection
                className={styles.FirstProject}
                title={cmsData?.exploreMore?.firstProject?.title}
                link={{
                    url: '/#',
                    text: cmsData?.exploreMore?.firstProject?.link?.text,
                }}
                backgroundColor={cmsData?.exploreMore?.firstProject?.backgroundColor}
                imageUrl={cmsData?.exploreMore?.firstProject?.image}
                description={cmsData?.exploreMore?.firstProject?.description}
            />
        </div>
    );
};

export default DesignersPagePreview;
