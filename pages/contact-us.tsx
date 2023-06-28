import { SanityImage } from '@/components/reusable/SanityImage/SanityImage';
import SupportService from '@/components/SupportService/SupportService';
import { Card } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import { useEffect } from 'react';
import { getKey } from 'utils';
import SeoMetaData from '../components/globals/SeoMetaData';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import {
  getContactPageContent,
  selectContactPageCmsData
} from '../store/reducers/pageSlice';
import styles from '../styles/pages/Contact.module.scss';

const ContactUs = () => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectContactPageCmsData);

  useEffect(() => {
    dispatch(getContactPageContent());
  }, [dispatch]);

  return (
    <div className={styles.Contact}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <BigImageTitleDescLinkBlock
        title={cmsData?.pageCoverSection?.title}
        backgroundColor={cmsData?.pageCoverSection?.backgroundColor}
        description={cmsData?.pageCoverSection?.description}
        className={cs(styles.PageCoverSection)}
        textColor="#fff"
        size="medium"
      />
      <div className={cs('witt-container', styles.ContentContainer)}>
        <div className={styles.LeftSection}>
          <div className={styles.SectionGroup}>
            <div className={styles.SectionContent}>
              {cmsData?.contactSection?.services?.map(
                (service: { name: string; contacts: Array<any> }) => (
                  <SupportService
                    key={getKey('service-')}
                    name={service.name}
                    contacts={service.contacts}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div className={styles.RightSection}>
          <Card
            imageUrl=""
            className={styles.ContentCard}
            title={cmsData?.headquarterSection?.title}
            description={cmsData?.headquarterSection?.description}
            ImageElement={
              <div className={styles.SanityImageWrapper}>
                {cmsData?.headquarterSection?.image?.asset ? (
                  <SanityImage image={cmsData?.headquarterSection?.image} />
                ) : null}
              </div>
            }
            // onClick={() => handleClicked(item?.itemUrl ?? '#')}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
