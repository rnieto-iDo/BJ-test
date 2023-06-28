import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import cs from 'classnames';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import HeaderTextBlock from 'blocks/text-blocks/text-block/HeaderTextBlock';
import TextWithButtonBlock from 'blocks/text-blocks/text-with-button-block/TextWithButtonBlock';
import TextWithImageRightAndBelow from 'blocks/image-blocks/text-with-image-right-and-below/TextWithImageRightAndBelow';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';
import ExpandableTextSection from '@/components/reusable/ExpandableTextSection';
import styles from '../../styles/pages/support/CareAndMaintenance.module.scss';

import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getCareAndMaintenancePageContent,
  selectCareAndMaintenanceCmsData
} from '../../store/reducers/pageSlice';

import SeoMetaData from '../../components/globals/SeoMetaData';

const CareAndMaintenance = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCareAndMaintenanceCmsData);

  useEffect(() => {
    dispatch(getCareAndMaintenancePageContent());
  }, [dispatch]);

  const handleButtonClick = (href: string) => {
      if (href) router.push(href);
  };

  return (
    <div className={styles.CareAndMaintenance}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <BigImageTitleDescLinkBlock
        backgroundColor={cmsData?.introExploreSection?.backgroundColor}
        title={cmsData?.introExploreSection?.title}
        textColor="#fff"
        description={cmsData?.introExploreSection?.description}
        className={cs(styles.Heading)}
      />
      <TextWithImageRightAndBelow
        text={cmsData?.regularMaintenanceSection?.title}
        description={cmsData?.regularMaintenanceSection?.description}
        firstCard={cmsData?.regularMaintenanceSection?.content[0]}
        secondCard={cmsData?.regularMaintenanceSection?.content[1]}
      />
      <LineSeparatorBlock />
      <HeaderTextBlock text={cmsData?.howToSection?.title} textColor="#000" />

      {cmsData?.howToSection?.content?.map((item, index) => (
        <div key={item?.id}>
          <ExpandableTextSection
            title={item?.title}
            description={item?.description}
            image={item?.image}
            className="witt-container"
          />
          {index !== cmsData.howToSection.content.length - 1 ? (
            <LineSeparatorBlock />
          ) : (
            <EmptySeparatorBlock />
          )}
        </div>
      ))}

      {cmsData?.contactSection?.button ? (
          <TextWithButtonBlock
              text={cmsData?.contactSection?.text}
              buttonLabel={cmsData?.contactSection?.button?.text}
              buttonClick={() => handleButtonClick(cmsData?.contactSection?.button?.url)}
          />
      ) : null}
    </div>
  );
};

export default CareAndMaintenance;
