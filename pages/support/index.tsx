import cs from 'classnames';
import React, { useEffect } from 'react';

import SupportService from '@/components/SupportService/SupportService';
import {
  Card,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import { SanityImage } from '@/components/reusable/SanityImage/SanityImage';
import styles from '../../styles/pages/support/Support.module.scss';

import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getSupportPageContent,
  selectSupportCmsData
} from '../../store/reducers/pageSlice';

import SeoMetaData from '../../components/globals/SeoMetaData';
import { getKey } from '../../utils';

const Support = () => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectSupportCmsData);

  useEffect(() => {
    dispatch(getSupportPageContent());
  }, [dispatch]);

  return (
    <div className={styles.Support}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.introExploreSection?.title}
        backgroundColor={cmsData?.introExploreSection?.backgroundColor}
        image={cmsData?.introExploreSection?.image}
        description={cmsData?.introExploreSection?.description}
        className={cs(styles.ExploreSection)}
        fullsizeImage
      />

      <div>
        <div className="witt-container">
          <SectionHeader
            className={styles.CardCollageHeader}
            text={cmsData?.cardCollage?.title}
          />
        </div>
        <div className={styles.ProductStory}>
          {cmsData?.cardCollage?.cardItems.map(
            (productImage: any, index: number) => (
              <Card
                key={`product-story-${
                  productImage?.id || productImage?.image?.asset?.assetId
                }`}
                className={cs(
                  styles[`ProductImage-${index}`],
                  styles.GridCardItem
                )}
                imageUrl={productImage?.image}
                ImageElement={
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <div
                    className={cs(
                      styles[`ProductStoryImage-${index}`],
                      'SanityImageWrapperLink'
                    )}
                  >
                    {productImage?.image?.asset && (
                      <SanityImage image={productImage?.image} />
                    )}
                  </div>
                }
                title={productImage?.title ?? ''}
                description={productImage?.description ?? ''}
                textLayout="horizontal"
              />
            )
          )}
          {cmsData?.cardCollage?.link ? (
            <div className={styles.Link}>
              <WittLink active href={cmsData?.cardCollage?.link?.url ?? '#'}>
                {cmsData?.cardCollage?.link?.text}
              </WittLink>
            </div>
          ) : null}
        </div>
      </div>

      <BigImageTitleDescLinkBlock
        title={cmsData?.learnMoreExploreSection?.title}
        backgroundColor={cmsData?.learnMoreExploreSection?.backgroundColor}
        image={cmsData?.learnMoreExploreSection?.image}
        description={cmsData?.learnMoreExploreSection?.description}
        className={cs(styles.ExploreSection)}
        linkUrl={cmsData?.learnMoreExploreSection?.link?.url}
        linkText={cmsData?.learnMoreExploreSection?.link?.text}
      />

      <div className={cs('witt-container', styles.FrequentQuestions)}>
        <div className={styles.FrequentQuestionsTextWrapper}>
          <SectionHeader
            className={cs(styles.SectionHeader)}
            text={cmsData?.frequentQuestions?.title}
          />

          <WittLink
            href={cmsData?.frequentQuestions?.link?.url ?? ''}
            className={styles.AllQuestionLink}
          >
            {cmsData?.frequentQuestions?.link?.text}
          </WittLink>
        </div>
        {cmsData?.frequentQuestions?.questions?.map((question: any) => (
          <WittLink
            key={getKey('question-')}
            href={question?.link ?? ''}
            className={styles.QuestionLink}
          >
            {' '}
            {question.text}
          </WittLink>
        )) ?? null}

        <WittLink
          href={cmsData?.frequentQuestions?.link?.url ?? ''}
          className={styles.AllQuestionLinkFootnote}
        >
          {cmsData?.frequentQuestions?.link?.text}
        </WittLink>
      </div>

      <div className={styles.ContactSection}>
        <div className={styles.ContactIntroContainer}>
          <p className={styles.Title}>{cmsData?.contactSection?.title}</p>
          <p className={styles.Text}> {cmsData?.contactSection?.text}</p>
        </div>
        <div className={styles.Services}>
          {cmsData?.contactSection?.contacts?.services?.map(
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
      <BigImageTitleDescLinkBlock
        title={cmsData?.bottomExploreSection?.title}
        backgroundColor={cmsData?.bottomExploreSection?.backgroundColor}
        image={cmsData?.bottomExploreSection?.image}
        description={cmsData?.bottomExploreSection?.description}
        linkUrl={cmsData?.bottomExploreSection?.link?.url}
        linkText={cmsData?.bottomExploreSection?.link?.text}
        fullsizeImage
        imageFirst
      />
    </div>
  );
};

export default Support;
