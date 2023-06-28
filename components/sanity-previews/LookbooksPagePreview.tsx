import { Card, ExploreSection, SectionHeader } from '@witt-team/athens-component-library';
import cs from 'classnames';

import { allLookBooksContentQuery } from '../../api/queries/pages.queries';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/LookBooks.module.scss';

const LookbooksPagePreview = () => {
    const cmsData = usePreview(null, allLookBooksContentQuery);

    return (
        <div className={styles.LookBooks}>
            <ExploreSection
                title={cmsData?.lookBookHeader?.title}
                description={cmsData?.lookBookHeader?.description}
                imageUrl={cmsData?.lookBookHeader?.image}
                className={styles.HeadContainer}
                link={{ url: '#', text: '' }}
            />
            <SectionHeader text={cmsData?.lookBookSection?.title} className={styles.SectionTitle} />
            <div className={styles.TitleCardContainer}>
                <Card
                    className={styles.TitleCard}
                    title={cmsData?.lookBookSection?.lookBook?.title}
                    description={cmsData?.lookBookSection?.lookBook?.description}
                    imageUrl={cmsData?.lookBookSection?.lookBook?.image}
                    textLayout="horizontal"
                />
            </div>
            <SectionHeader text={cmsData?.lookBookList?.title} className={styles.SectionTitle} />
            <div className={styles.GridContainer}>
                {cmsData?.lookBookList?.lookBooks?.map((item: any) => (
                    <Card key={item?.id} title={item?.title} description={item?.description} imageUrl={item?.image} textLayout="horizontal" className={styles.GridItem} />
                ))}
            </div>
            <SectionHeader text={cmsData?.mixedContentList?.title} className={cs(styles.SectionTitle, styles.Divider)} />
            <div className={styles.MoreCollectionsGrid}>
                {cmsData?.mixedContentList?.mixedContent?.map((item: any) => (
                    <Card key={item?.id} title={item?.title} imageUrl={item?.image} textLayout="horizontal" className={cs(styles.GridItem, styles.MoreCollectionsGridItem)} />
                ))}
            </div>
        </div>
    );
};

export default LookbooksPagePreview;
