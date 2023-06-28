import { Breadcrumb, Card, ExploreSection, SectionFootnote, SectionHeader, WittLink } from '@witt-team/athens-component-library';
import cs from 'classnames';

import { allCollectionsContentQuery } from '../../api/queries/pages.queries';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/Collections.module.scss';
import DescriptiveSections from '../reusable/DescriptiveSections/DescriptiveSections';
import HeroImage from '../reusable/HeroImage/HeroImage';
import Timeline from '../reusable/Timeline/Timeline';

const CollectionsPagePreview = () => {
    const cmsData = usePreview(null, allCollectionsContentQuery);
    const breadcrumbs = useBreadcrumbs();

    return (
        <div className={styles.Collections}>
            <HeroImage className={styles.HeadImage} backgroundImage={cmsData?.cover?.image} title={cmsData?.cover?.title} additionalText={cmsData?.cover?.additionalText} />
            <Breadcrumb className={cs('witt-container', styles.BreadCrumbs)} items={breadcrumbs} />
            <SectionHeader className={cs('witt-container', styles.MainTitle)} text={cmsData?.title} />
            <DescriptiveSections descriptiveSections={cmsData?.descriptiveSections} />
            <div className={cs('witt-container', styles.MoreCollections)}>
                <SectionHeader className={styles.SectionHeader} text={cmsData?.moreCollections?.title} />
                <div className={styles.MoreCollectionsGrid}>
                    {cmsData?.moreCollections?.collections.map((item: any) => (
                        <Card
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            isImageVertical
                            textLayout="vertical"
                            className={cs(styles.MoreCollectionsGridItem)}
                        />
                    )) ?? null}
                </div>
            </div>
            <div className="container-with-separator" />
            <div className={cs('witt-container', styles.OurDesigners)}>
                <SectionHeader className={styles.SectionHeader} text={cmsData?.ourDesigners?.title} />
                <div className={styles.OurDesignersGrid}>
                    {cmsData?.ourDesigners?.designers.map((item: any) => (
                        <Card title={item?.title || item?.name} description={item?.description} imageUrl={item.image} isImageVertical textLayout="vertical" className={cs(styles.CardGridItem)} />
                    )) ?? null}
                </div>
                <SectionFootnote size="medium" className={styles.OurDesignersFootnote}>
                    <WittLink className={styles.SectionLink} active href={cmsData?.ourDesigners?.footnoteLink?.url ?? ''}>
                        {cmsData?.ourDesigners?.footnoteLink?.text || 'Read More'}
                    </WittLink>
                </SectionFootnote>
            </div>
            <ExploreSection
                className={cs(styles.ExploreRetailersSection)}
                title={cmsData?.exploreLocations?.title}
                link={{
                    url: '/#',
                    text: cmsData?.exploreLocations?.link?.text,
                }}
                backgroundColor={cmsData?.exploreLocations?.backgroundColor}
            />
            <div className={cs('witt-container', styles.TimelineWrapper)}>
                <SectionHeader text="Explore More on Brown Jordan" className={styles.SectionHeader} />
                <Timeline />
            </div>
            <div className="container-with-separator" />
            <div className={cs('witt-container', styles.MixedContent)}>
                <div className={styles.MixedContentGrid}>
                    {cmsData?.mixedContent?.map((item: any) => (
                        <Card
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            isImageVertical
                            textLayout="vertical"
                            className={cs(styles.MixedContentGridItem)}
                        />
                    )) ?? null}
                </div>
            </div>
            <ExploreSection
                title={cmsData?.exploreFirstProject?.title}
                link={{
                    url: '/#',
                    text: cmsData?.exploreFirstProject?.link?.text,
                }}
                backgroundColor={cmsData?.exploreFirstProject?.backgroundColor}
                imageUrl={cmsData?.exploreFirstProject?.image}
                description={cmsData?.exploreFirstProject?.description}
                className={cs(styles.ExploreSection)}
            />
        </div>
    );
};

export default CollectionsPagePreview;
