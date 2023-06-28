import { Button, Card, SectionHeader } from '@witt-team/athens-component-library';
import cs from 'classnames';
import { FC } from 'react';

import { individualLookbookPageQuery } from '../../api/queries/pages.queries';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/IndividualLookbook.module.scss';
import Divider from '../reusable/Divider/Divider';

type IndividualLookbookProps = {
    slug: string | string[];
    handleDownload: (url: string) => void;
};

const IndividualLookbookPagePreview: FC<IndividualLookbookProps> = ({ slug, handleDownload }) => {
    const cmsData = usePreview(null, individualLookbookPageQuery(slug));

    return (
        <div className={styles.IndividualLookbook}>
            <div className={styles.GreenBackgroundWrapper}>
                <div className={styles.TopSection}>
                    <h1 className={styles.LookbookName}>{cmsData?.lookbookName} </h1>
                    <p className={styles.LookbookDescription}>{cmsData?.lookbookDescription} </p>
                </div>
                <Divider />
                <Button onClick={() => handleDownload(cmsData?.lookbookFileUrl)} className={styles.DownloadButton} variant="outlined">
                    Download PDF
                </Button>
                <h2 className={styles.MainTitle}>{cmsData?.mainTitle}</h2>
                <div className={styles.VideoSection}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
                    <img className={styles.Media} src={cmsData?.videoSection?.videoUrl} alt="not-loaded" />
                    <p className={styles.VideoDescription}>{cmsData?.videoSection?.description}</p>
                </div>
                <p className={styles.VideoText}>{cmsData?.videoSection?.text}</p>
                <div className={styles.SubSection}>
                    <h2 className={styles.SubTitle}>{cmsData?.subSection?.title}</h2>
                    <p className={styles.SubText}>{cmsData?.subSection?.text}</p>
                </div>
                <div className={styles.HighlightedProductsGrid}>
                    {cmsData?.highlightedProducts.map((item: any) => (
                        <Card className={styles.HighLightedGridItem} imageUrl={item.image} title={item.title} />
                    ))}
                </div>
                <Divider className={styles.LookbookSeparator} />
            </div>
            <div className={styles.ProductsSection}>
                <SectionHeader text={cmsData?.prodcutsSection?.title} className={cs(styles.SectionTitle, styles.Divider)} />
                <div className={styles.ProductsGrid}>
                    {cmsData?.prodcutsSection?.products.map((item: any) => (
                        <Card className={styles.ProductGridItem} imageUrl={item.image} title={item.title} />
                    ))}
                </div>
            </div>
            <Divider className={styles.LookbookSeparator} />
            <SectionHeader text={cmsData?.exploreMore?.title} className={cs(styles.SectionTitle, styles.Divider, styles.ExploreMoreTitle)} />
            <div className={styles.MoreCollectionsGrid}>
                {cmsData?.exploreMore?.items?.map((item: any) => (
                    <Card key={item?.id} title={item?.title} imageUrl={item?.image} textLayout="horizontal" className={cs(styles.GridItem, styles.MoreCollectionsGridItem)} />
                ))}
            </div>
        </div>
    );
};

export default IndividualLookbookPagePreview;
