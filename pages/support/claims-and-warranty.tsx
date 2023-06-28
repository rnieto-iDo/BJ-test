import cs from 'classnames';
import { useEffect } from 'react';

import WarrantyItem, {
  WarrantyItemProps
} from '@/components/WarrantyItem/WarrantyItem';
import Divider from '@/components/reusable/Divider/Divider';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import Link from 'next/link';
import styles from '../../styles/pages/support/ClaimsAndWarranty.module.scss';

import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getClaimsAndWarrantyPageContent,
  selectClaimsAndWarrantyCmsData
} from '../../store/reducers/pageSlice';

import SeoMetaData from '../../components/globals/SeoMetaData';

const ClaimsAndWarranty = () => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectClaimsAndWarrantyCmsData);

  useEffect(() => {
    dispatch(getClaimsAndWarrantyPageContent());
  }, [dispatch]);

  return (
    <div className={styles.ClaimsAndWarranty}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.introExploreSection?.title}
        backgroundColor={cmsData?.introExploreSection?.backgroundColor}
        description={cmsData?.introExploreSection?.description}
        textColor="#fff"
        size="medium"
      />

      {cmsData?.topSectionText ? (
        <>
          <div className={cs('witt-container', styles.TopSectionText)}>
            {cmsData?.topSectionText}
          </div>

          <Divider />
        </>
      ) : null}

      <div className={styles.WarrantySection}>
        <div className={styles.Header}>
          <h2 className={styles.Title}>{cmsData?.claimsSection?.title}</h2>
          <div className={styles.WarrantyLinks}>
            {cmsData?.claimsSection?.links.map(link => (
              <Link
                target="_blank"
                className={styles.Link}
                href={link?.url ?? ''}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.WarrantyList}>
          {cmsData?.claimsSection?.items?.map((item: WarrantyItemProps) => (
            <WarrantyItem
              additionalInfo={item.additionalInfo}
              label={item.label}
              value={item.value}
              noMultiLine
            />
          ))}
        </div>
      </div>

      <Divider />

      <div className={styles.WarrantySection}>
        <div className={styles.Header}>
          <h2 className={styles.Title}>{cmsData?.warrantySection?.title}</h2>
          <div className={styles.WarrantyLinks}>
            {cmsData?.warrantySection?.links.map(link => (
              <Link
                target="_blank"
                className={styles.Link}
                href={link?.url ?? ''}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.WarrantyList}>
          {cmsData?.warrantySection?.items?.map((item: WarrantyItemProps) => (
            <WarrantyItem
              additionalInfo={item.additionalInfo}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimsAndWarranty;
