import { Card, ExploreSection, SectionFootnote, SectionHeader, WittLink } from '@witt-team/athens-component-library';
import { Timeline } from 'antd';
import cs from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import HeroImage from '../reusable/HeroImage/HeroImage';
import { homePageContentQuery } from '../../api/queries/pages.queries';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/Home.module.scss';
import VideoPlayer from '../reusable/VideoPlayer/VideoPlayer';
import { SanityImage } from '../reusable/SanityImage/SanityImage';

const HomePagePreview = () => {
    const router = useRouter();
    const cmsData = usePreview(null, homePageContentQuery);

    const handleCardImageTitleClicked = (href: string) => {
        router.push(href);
    };

    return (
        <div className={styles.Home}>
            <HeroImage
                className={styles.PageCover}
                backgroundImage={cmsData?.cover?.image}
                title={cmsData?.cover?.title}
                additionalText={cmsData?.cover?.additionalText}
                video={
                    cmsData?.cover?.videoUrl ? <VideoPlayer playbackId={cmsData?.cover?.videoUrl} className={styles.VideoSection} /> : null
                }
            />

            <div className="container-with-separator">
                <SectionHeader className={styles.MainSectionHeader} text={cmsData?.title} />
                <SectionFootnote className={styles.TopSectionFootnote} size="large">
                    <WittLink active href={cmsData?.titleLink?.url ?? ''}>
                        {cmsData?.titleLink?.text}
                    </WittLink>
                </SectionFootnote>
            </div>
            <div className={cs('witt-container', styles.ExploreCollectionsWrapper)}>
                <SectionHeader className={styles.SectionHeader} text={cmsData?.exploreCollections?.title} />
                <div className={styles.ExploreCollectionsItems}>
                    {cmsData?.exploreCollections?.collections.map((item: any) => (
                        <Link href={item?.link?.url || ''} className={styles.ExploreCollectionsItemLink}>
                            <Card className={styles.CardGridItem} imageUrl={item.image} title={item.title} description={item.description} textLayout="horizontal" />
                        </Link>
                    ))}
                </div>
            </div>
            <div className="witt-container">
                <SectionFootnote size="medium">
                    <WittLink className={styles.SectionLink} href={cmsData?.exploreCollections?.footnoteLink?.url ?? ''} active>
                        {cmsData?.exploreCollections?.footnoteLink?.text}
                    </WittLink>
                </SectionFootnote>
            </div>
            <div className="witt-container">
                <div className={styles.FeaturedProductSeparator} />
            </div>
            <div className="witt-container">
                <SectionHeader className={styles.SectionHeader} text={cmsData?.featuredProducts?.title} />
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.FeaturedProductsHeadImage} src={cmsData?.featuredProducts?.mainImage} alt="not-loaded" />
            <div className={styles.FeaturedProducts}>
                {cmsData?.featuredProducts?.products.map((item: any, index: number) => (
                    <Card
                        className={cs(styles.FeaturedGridItem, styles[`FeaturedProduct-${index}`])}
                        imageUrl={item.image}
                        title={item.title}
                        description={item.description}
                        onClick={() => handleCardImageTitleClicked(item.link.url)}
                        textLayout="horizontal"
                    />
                ))}
            </div>
            
             <div className={cs('witt-container', styles.OurDesigners)}>
                <SectionHeader className={styles.SectionHeader} text={cmsData?.ourDesigners?.title} />

                <div className={styles.OurDesignersGrid}>
                    {cmsData?.ourDesigners?.designers.map((item: any) => (
                        <Card
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            ImageElement={
                                <div className={styles.DesignerImage}>
                                    {item?.image?.asset ? <SanityImage image={item.image} />: null}
                                </div>
                            }
                            isImageVertical
                            textLayout="vertical"
                            className={cs(styles.CardGridItem)}
                            onClick={() => handleCardImageTitleClicked(item.link.url)}
                        />
                    )) ?? null}
                </div>
                <SectionFootnote size="medium" className={styles.OurDesignersFootnote}>
                    <WittLink className={styles.SectionLink} active href={cmsData?.ourDesigners?.footnoteLink?.url ?? ''}>
                        {cmsData?.ourDesigners?.footnoteLink?.text}
                    </WittLink>
                </SectionFootnote>
            </div>


            <div className="container-with-separator">
                <SectionFootnote size="medium">
                    <WittLink className={styles.SectionLink} href="/feature-products" active>
                        {cmsData?.featuredProducts?.footnoteLink?.text}
                    </WittLink>
                </SectionFootnote>
            </div>
            <div className={cs('witt-container', styles.BestSellers)}>
                <div className={styles.BestSellersTextWrapper}>
                    <SectionHeader className={cs(styles.SectionHeader)} text={cmsData?.bestSellers?.title} />

                    <WittLink active href={cmsData?.bestSellers?.link?.url ?? ''}>
                        {cmsData?.bestSellers?.link?.text}
                    </WittLink>
                </div>
                {cmsData?.bestSellers?.products.map((item: any) => (
                    <Card
                        title={item?.title || item?.name}
                        description={item?.description}
                        imageUrl={item.image}
                        isImageVertical
                        textLayout="vertical"
                        className={cs(styles.CardGridItem, styles.BestSellersGridItem)}
                        onClick={() => handleCardImageTitleClicked(item.link.url)}
                    />
                )) ?? null}

                <SectionFootnote size="medium" className={styles.BestSellersTextWrapperBottom}>
                    <WittLink active href={cmsData?.bestSellers?.link?.url ?? ''}>
                        {cmsData?.bestSellers?.link?.text}
                    </WittLink>
                </SectionFootnote>
            </div>
            <ExploreSection
                title={cmsData?.exploreMore?.title}
                description={cmsData?.exploreMore?.description}
                link={{
                    text: cmsData?.exploreMore?.link?.text,
                    url: cmsData?.exploreMore?.link?.url ?? '',
                }}
                imageUrl={cmsData?.exploreMore?.image}
                backgroundColor={cmsData?.exploreMore?.backgroundColor}
                className={styles.ExploreSection}
            />
           
            <ExploreSection
                title={cmsData?.exploreAboutUs?.title}
                link={{
                    text: cmsData?.exploreAboutUs?.link?.text,
                    url: cmsData?.exploreAboutUs?.link?.url ?? '',
                }}
                imageUrl={cmsData?.exploreAboutUs?.image}
                backgroundColor={cmsData?.exploreAboutUs?.backgroundColor}
                className={cs(styles.ExploreSection, styles.ExploreSectionAboutUs)}
            />
            <div className={cs('witt-container', styles.TimelineWrapper)}>
                <SectionHeader text="Explore More on Brown Jordan" className={styles.SectionHeader} />

                <Timeline />
            </div>
            <ExploreSection
                title={cmsData?.exploreLocations?.title}
                link={{
                    text: cmsData?.exploreLocations?.link?.text,
                    url: cmsData?.exploreLocations?.link?.url ?? '',
                }}
                imageUrl={cmsData?.exploreLocations?.image}
                backgroundColor={cmsData?.exploreLocations?.backgroundColor}
                className={cs(styles.ExploreSection, styles.ExploreLocations)}
            />
            <div className={cs('container-with-separator', styles.Lookbooks)}>
                <div className={cs(styles.SectionHeaderWithLink, styles.LoobooksHeaderWrapper)}>
                    <SectionHeader text={cmsData?.lookbooks?.title} className={cs(styles.SectionHeader, styles.LookbooksSectionHeader)} />
                    <WittLink active href={cmsData?.lookbooks?.titleLink?.url ?? ''} className={styles.LookbooksSectionLink}>
                        {cmsData?.lookbooks?.titleLink?.text}
                    </WittLink>
                </div>
                <div className={styles.LookbooksGrid}>
                    {cmsData?.lookbooks?.selectedLookbooks.map((item: any) => (
                        <Card
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            isImageVertical
                            textLayout="vertical"
                            className={cs(styles.CardGridItem, styles.LookbooksGridItem)}
                            onClick={() => handleCardImageTitleClicked(item.link.url)}
                        />
                    )) ?? null}
                    <WittLink active href={cmsData?.inTheNews?.titleLink?.url ?? ''} className={styles.LookbooksGridLink}>
                        {cmsData?.inTheNews?.titleLink?.text}
                    </WittLink>
                </div>
            </div>
            <div className={cs('witt-container', styles.InTheNews)}>
                <div className={cs(styles.SectionHeaderWithLink, styles.InTheNewsHeaderWrapper)}>
                    <SectionHeader text={cmsData?.inTheNews?.title} className={styles.SectionHeader} />
                    <WittLink active href={cmsData?.inTheNews?.titleLink?.url ?? ''} className={styles.InTheNewsHeaderLink}>
                        {cmsData?.inTheNews?.titleLink?.text}
                    </WittLink>
                </div>
                <div className={styles.InTheNewsGrid}>
                    {cmsData?.inTheNews?.news.map((item: any) => (
                        <Card
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            isImageVertical
                            date={item?.date}
                            className={cs(styles.CardGridItem, styles.InTheNewsGridItem)}
                            onClick={() => handleCardImageTitleClicked(item.link.url)}
                        />
                    )) ?? null}
                    <WittLink active href={cmsData?.inTheNews?.titleLink?.url ?? ''} className={styles.InTheNewsLink}>
                        {cmsData?.inTheNews?.titleLink?.text}
                    </WittLink>
                </div>
            </div>
            <ExploreSection
                title={cmsData?.exploreFirstProject?.title}
                link={{
                    url: cmsData?.exploreFirstProject?.link?.url ?? '',
                    text: cmsData?.exploreFirstProject?.link?.text,
                }}
                backgroundColor={cmsData?.exploreFirstProject?.backgroundColor}
                imageUrl={cmsData?.exploreFirstProject?.image}
                description={cmsData?.exploreFirstProject?.description}
                className={cs(styles.ExploreSection, styles.ExploreSectionMyProject)}
            />
        </div>
    );
};

export default HomePagePreview;
