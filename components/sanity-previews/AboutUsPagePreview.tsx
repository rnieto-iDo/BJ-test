import { Card, DescriptiveSection, ExploreSection, SectionHeader, WittLink } from '@witt-team/athens-component-library';
import { Timeline } from 'antd';
import cs from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import { aboutUsPageQuery } from '../../api/queries/pages.queries';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/AboutUs.module.scss';
import { transformDateFormat } from '../../utils';
import Divider from '../reusable/Divider/Divider';

type AboutUsPagePreviewProps = {
    handleCardImageTitleClicked: (href: string) => void;
};

const AboutUsPagePreview: FC<AboutUsPagePreviewProps> = ({ handleCardImageTitleClicked }) => {
    const cmsData = usePreview(null, aboutUsPageQuery);

    return (
        <div className={styles.AboutUs}>
            <SectionHeader className={cs(styles.MainTitle)} text={cmsData?.mainTitle} />
            <div className={cs(styles.FirstHouseSectionWrapper)}>
                <Card
                    className={styles.FirstHouseSection}
                    imageUrl={cmsData?.firstHouseSection?.image}
                    title={cmsData?.firstHouseSection?.title}
                    description={cmsData?.firstHouseSection?.description}
                    textLayout="horizontal"
                />
            </div>
            <div className={cs(styles.SecondHouseSectionWrapper)}>
                <Card
                    className={cs(styles.HouseCard, styles.SecondHouseCard)}
                    imageUrl={cmsData?.secondHouseSection?.houseCard?.image}
                    title={cmsData?.secondHouseSection?.houseCard?.title}
                    description={cmsData?.secondHouseSection?.houseCard?.description}
                    textLayout="horizontal"
                />
                <div className={cs(styles.TextWrapper)}>
                    <h2 className={styles.MainText}>{cmsData?.secondHouseSection?.mainText}</h2>
                    <div className={cs(styles.SubTextWrapper)}>
                        <p className={styles.FirstSubText}>{cmsData?.secondHouseSection?.firstSubSection}</p>
                        <p className={styles.SecondSubText}>{cmsData?.secondHouseSection?.secondSubSection}</p>
                    </div>
                </div>
            </div>
            <div className={styles.VideoSection}>
                <div className={styles.MediaWrapper}>
                    <Image src={cmsData?.videoSection?.media} alt="not-loaded" fill object-fit="cover" />
                </div>
                <p className={styles.MediaDescription}>{cmsData?.videoSection?.description}</p>
            </div>
            <ExploreSection
                title={cmsData?.readMoreSection?.title}
                description={cmsData?.readMoreSection?.description}
                link={{
                    text: cmsData?.readMoreSection?.link?.text,
                    url: cmsData?.readMoreSection?.link?.url ?? '',
                }}
                imageUrl={cmsData?.readMoreSection?.image}
                backgroundColor={cmsData?.readMoreSection?.backgroundColor}
                className={styles.ReadMoreSection}
            />

            <div className={cs(styles.DescriptiveSections)}>
                <DescriptiveSection
                    className={cs(styles.DescriptiveSection, styles.FirstDescriptiveSection)}
                    imageUrl={cmsData?.descriptiveSections?.firstSection?.image}
                    title={cmsData?.descriptiveSections?.firstSection?.title}
                    description={cmsData?.descriptiveSections?.firstSection?.description}
                    layout={cmsData?.descriptiveSections?.firstSection?.layout}
                    textPosition={cmsData?.descriptiveSections?.firstSection?.textPosition}
                />
                <DescriptiveSection
                    className={cs(styles.DescriptiveSection, styles.SecondDescriptiveSection)}
                    imageUrl={cmsData?.descriptiveSections?.secondSection?.image}
                    title={cmsData?.descriptiveSections?.secondSection?.title}
                    description={cmsData?.descriptiveSections?.secondSection?.description}
                    layout={cmsData?.descriptiveSections?.secondSection?.layout}
                    textPosition={cmsData?.descriptiveSections?.secondSection?.textPosition}
                />
            </div>
            <ExploreSection
                title={cmsData?.warrantySection?.title}
                description={cmsData?.warrantySection?.description}
                link={{
                    text: cmsData?.warrantySection?.link?.text,
                    url: cmsData?.warrantySection?.link?.url ?? '',
                }}
                imageUrl={cmsData?.warrantySection?.image}
                backgroundColor={cmsData?.warrantySection?.backgroundColor}
                className={cs(styles.ExploreSection, styles.WarrantySection)}
            />
            <div className={styles.TimelineWrapper}>
                <Timeline />
            </div>
            <Divider />
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
                            title={item?.title || item?.name}
                            description={item?.description}
                            imageUrl={item.image}
                            date={transformDateFormat(item?.date)}
                            className={cs(styles.CardGridItem)}
                            onClick={() => handleCardImageTitleClicked(item.link.url)}
                        />
                    )) ?? null}
                </div>
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
        </div>
    );
};

export default AboutUsPagePreview;
