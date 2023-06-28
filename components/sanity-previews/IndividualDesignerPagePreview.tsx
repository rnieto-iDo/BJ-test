import { Card, ExploreSection, SectionFootnote, SectionHeader, WittLink } from '@witt-team/athens-component-library';
import { Breadcrumb } from 'antd';
import cs from 'classnames';
import { FC } from 'react';

import { individualDesignerPageContentQuery } from '../../api/queries/pages.queries';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/DiscoverIndividualDesigner.module.scss';

type IndividualDesignerProps = {
    slug: string | string[];
    breadcrumbs: any[];
    transformDateFormat: (date: string) => string;
    handleCardImageTitleClicked: (url: string) => void;
};

const IndividualDesignerPagePreview: FC<IndividualDesignerProps> = ({ slug, breadcrumbs, transformDateFormat, handleCardImageTitleClicked }) => {
    const cmsData = usePreview(null, individualDesignerPageContentQuery(slug));

    return (
        <div className={cs(styles.DiscoverIndividualDesigner)}>
            <div className={styles.PageCover}>
                <div className={styles.TextContainer}>
                    <h1>{cmsData?.title}</h1>
                    <p>{cmsData?.description}</p>
                </div>
                <div className={styles.ImageContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cmsData?.headerImage?.asset?.url} alt="not-loaded" />
                </div>
            </div>

            <div className={cs('witt-container')}>
                <Breadcrumb items={breadcrumbs} />
            </div>

            <div className={cs('witt-container', styles.MainTitle)}>
                <div className={styles.MainTitleText}>{cmsData?.mainText}</div>
            </div>

            <div className={cs('witt-container', styles.ThreeColumnText)}>
                <div>&nbsp;</div>
                <div>{cmsData?.mainDescription?.col1}</div>
                <div>{cmsData?.mainDescription?.col2}</div>
            </div>

            {/* STOPED HERE - REPLACE THIS PLACEHOLDER IMAGE WITH ACUTALL VIDEO COMPONENT */}
            <div className={styles.Animation}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cmsData?.videoSection?.media} alt="not-loaded" />
                <div className={cs('witt-container')}>
                    <p>{cmsData?.videoSection?.description}</p>
                </div>
            </div>

            <div className={cs('container-with-separator')}>
                <div className={cs(styles.TextBelowAnimation)}>{cmsData?.textBelowAnimation}</div>
            </div>

            <div className={cs('container-with-separator')}>
                <SectionHeader text={cmsData?.featuredCollections?.title} />
                <div className={styles.FeaturedCollections}>
                    {cmsData?.featuredCollections?.collections?.map((collection: any, index: number) => (
                        <Card
                            key={`collection-${collection?.id || collection?.image}`}
                            className={cs(styles[`Collection-${index}`])}
                            imageUrl={collection?.image}
                            title={collection?.title ?? ''}
                            description={collection?.description ?? ''}
                            textLayout="horizontal"
                        />
                    ))}
                </div>

                <SectionFootnote size="medium" className={styles.OurDesignersFootnote}>
                    <WittLink className={styles.Link} active href={cmsData?.featuredCollections?.link?.url ?? ''}>
                        {cmsData?.featuredCollections?.link?.text}
                    </WittLink>
                </SectionFootnote>
            </div>

            <div className={cs('witt-container')}>
                <SectionHeader text={cmsData?.moreCollections?.title} />
                <div className={cs(styles.MoreCollectionsGrid)}>
                    {cmsData?.moreCollections?.collections.map((collection: any, index: number) => (
                        <Card
                            key={`more-collections-${collection?.id}`}
                            className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])}
                            imageUrl={collection?.image}
                            title={collection?.title}
                            description={collection?.description}
                        />
                    )) ?? []}
                </div>
            </div>

            <div className={cs('witt-container', styles.TextBelowMoreCollections)}>
                <div className={styles.Text}>{cmsData?.textBelowMoreCollections?.text}</div>

                <WittLink className={styles.Link} active href={cmsData?.textBelowMoreCollections?.link?.url ?? ''}>
                    {cmsData?.textBelowMoreCollections?.link?.text}
                </WittLink>
            </div>

            <div className={cs('container-with-separator')}>
                <div className={cs(styles.ExploreMoreGrid)}>
                    {cmsData?.featuredProducts?.map((item: any, index: number) => (
                        <Card key={`featured-products-${item?.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={item?.image} title={item?.title} />
                    )) ?? []}
                </div>
            </div>

            <div className={cs('container-with-separator', styles.OurDesigners)}>
                <SectionHeader className={styles.SectionHeader} text={cmsData?.ourDesigners?.title} />
                <div className={styles.ExploreMoreGrid}>
                    {cmsData?.ourDesigners?.designers?.map((item: any, index: number) => (
                        <Card key={`our-designers-${item?.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={item?.image} title={item?.name} />
                    )) ?? []}
                </div>
            </div>

            <div className={cs('witt-container')}>
                <SectionHeader text={cmsData?.exploreMore?.title} />
                <div className={cs(styles.ExploreMoreGrid)}>
                    {cmsData?.exploreMore?.mixedContent?.map((product: any, index: number) => (
                        <Card key={`explore-more-${product?.id}`} className={cs(styles.CardWithoutOverflow, styles[`GridItem-${index}`])} imageUrl={product?.image} title={product?.title} />
                    )) ?? []}
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

            <div className={cs(styles.InTheNews)}>
                <div className={cs(styles.SectionHeaderWithLink, styles.InTheNewsHeaderWrapper)}>
                    <SectionHeader text={cmsData?.inTheNews?.title} className={styles.SectionHeader} />
                    <WittLink className={styles.SectionheaderLink} active href={cmsData?.inTheNews?.titleLink?.url ?? ''}>
                        {cmsData?.inTheNews?.titleLink?.text}
                    </WittLink>
                </div>
                <div className={cs(styles.InTheNewsGrid)}>
                    {cmsData?.inTheNews?.news.map((item: any) => (
                        <Card
                            key={`news-${item?.id}`}
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            date={transformDateFormat(item?.date)}
                            className={cs(styles.CardGridItem, styles.CardWithoutOverflow)}
                            onClick={() => handleCardImageTitleClicked(item.link.url)}
                        />
                    )) ?? null}
                </div>
            </div>

            <div className={styles.ShowRoomSection}>
                <h1>{cmsData?.showRoomSection?.text ?? ''}</h1>
                <p>
                    <WittLink className={styles.SectionheaderLink} active href={cmsData?.showRoomSection?.link?.url ?? ''}>
                        {cmsData?.showRoomSection?.link?.text}
                    </WittLink>
                </p>
            </div>
        </div>
    );
};

export default IndividualDesignerPagePreview;
