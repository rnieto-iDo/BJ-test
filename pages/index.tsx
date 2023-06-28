import {
  Card,
  SectionFootnote,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';

import HeroBlock from 'blocks/hero-block/HeroBlock';
import { ItemProp } from 'blocks/image-blocks/title-two-image-link/TitleTwoImageWithLinkBlock.types';
import ThreeImageWithDescLinkBlock from 'blocks/image-blocks/three-image-with-desc-link/ThreeImageWithDescLinkBlock';
import FourImageBlock from 'blocks/image-blocks/four-image-row/FourImageBlock';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import HeaderTextBlock from 'blocks/text-blocks/text-block/HeaderTextBlock';
import TextWithLinkBlock from 'blocks/text-blocks/text-with-link-block/TextWithLinkBlock';
import TitleTwoImageWithLink from 'blocks/image-blocks/title-two-image-link/TitleTwoImageWithLinkBlock';

import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';

import { useRouter } from 'next/router';
import { FC, lazy, useEffect } from 'react';

import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';

import { SanityImage } from '../components/reusable/SanityImage/SanityImage';
import Timeline from '../components/reusable/Timeline/Timeline';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import { getHomePageContent, selectCMSData } from '../store/reducers/pageSlice';
import styles from '../styles/pages/Home.module.scss';
import { getKey, transformDateFormat } from '../utils';

import SeoMetaData from '../components/globals/SeoMetaData';

const HomePagePreview = lazy(
  () => import('../components/sanity-previews/HomePagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

const LAYOUT_A = 'template-a'; //   large data
const LAYOUT_B = 'template-b'; //   medium data

type HomeProps = {
  pageProps: {
    preview: boolean;
  };
};

const Home: FC<HomeProps> = ({ pageProps: { preview } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);

  useEffect(() => {
    if (preview) return;
    dispatch(getHomePageContent());
  }, [dispatch, preview]);

  const handleCardImageTitleClicked = (href: string) => {
    router.push(href);
  };

  function prepareImageItem(collection: Array<any>, index: number): ItemProp {
    const item = {
      title: '',
      description: '',
      imageUrl: '',
      image: null,
      itemUrl: ''
    };

    if (collection && collection.length >= index) {
      const obj = collection[index];
      item.title = obj.title || obj.name;
      item.description = obj.description;
      item.image = obj.image?.asset ? obj.image : null;
      item.imageUrl = obj.image;
      item.itemUrl = obj.link?.url;
    }
    return item;
  }

  const getLayout = value => {
    if (!value || value === LAYOUT_A) {
      return LAYOUT_A;
    }

    return LAYOUT_B;
  };

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <HomePagePreview />
    </PreviewSuspense>
  ) : (
    <div className={styles.Home}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <HeroBlock
        heroTitle={cmsData?.cover?.title}
        heroText={cmsData?.cover?.additionalText}
        backgroundImageUrl={cmsData?.cover?.image}
        videoUrl={cmsData?.cover?.videoUrl}
        className={styles.HeroBlock}
      />

      <TextWithLinkBlock
        text={cmsData?.title}
        linkText={cmsData?.titleLink?.text}
        linkUrl={cmsData?.titleLink?.url}
      />

      <LineSeparatorBlock />

      {getLayout(cmsData?.layout) === LAYOUT_B &&
        cmsData?.featuredCollections && (
          <>
            <div className={cs('witt-container', styles.FeaturedCollections)}>
              <SectionHeader text={cmsData?.featuredCollections?.title} />
              <Card
                className={styles.FeaturedCollectionMain}
                title={cmsData?.featuredCollections?.mainCollection?.title}
                description={
                  cmsData?.featuredCollections?.mainCollection?.description
                }
                textLayout="horizontal"
                imageUrl={cmsData?.featuredCollections?.mainCollection?.image}
                onClick={() =>
                  handleCardImageTitleClicked(
                    cmsData?.featuredCollections?.mainCollection.link?.url ||
                      '/#'
                  )
                }
              />

              <div className={styles.OtherCollections}>
                {cmsData?.featuredCollections?.otherCollections.map(
                  (collection: any, index: number) => (
                    <Card
                      key={`other-collections-${collection?.id}`}
                      className={cs(styles[`Collection-${index}`])}
                      title={collection?.title}
                      description={collection?.description}
                      textLayout="horizontal"
                      imageUrl={collection?.image}
                      onClick={() =>
                        handleCardImageTitleClicked(
                          collection?.link?.url || '/#'
                        )
                      }
                    />
                  )
                ) ?? []}
              </div>
            </div>

            <div className={cs('container-with-separator')}>
              <SectionHeader
                className={cs(styles.FeaturedCollectionsFootnoteDescription)}
                text={cmsData?.featuredCollections?.description}
              />
              <SectionFootnote
                size="medium"
                className={styles.FeaturedCollectionsFootnoteLink}
              >
                <WittLink
                  active
                  href={cmsData?.featuredCollections?.footnoteLink?.url ?? ''}
                >
                  {cmsData?.featuredCollections?.footnoteLink?.text}
                </WittLink>
              </SectionFootnote>
            </div>
          </>
        )}

      <TitleTwoImageWithLink
        title={cmsData?.exploreCollections?.title}
        firstItem={prepareImageItem(
          cmsData?.exploreCollections?.collections,
          0
        )}
        secondItem={prepareImageItem(
          cmsData?.exploreCollections?.collections,
          1
        )}
        linkText={cmsData?.exploreCollections?.footnoteLink?.text}
        linkUrl={cmsData?.exploreCollections?.footnoteLink?.url ?? ''}
      />

      {getLayout(cmsData?.layout) === LAYOUT_A && (
        <>
          <HeaderTextBlock text={cmsData?.featuredProducts?.title} />

          <HeroBlock
            backgroundImageUrl={cmsData?.featuredProducts?.mainImage}
            videoUrl={cmsData?.featuredProducts?.videoUrl}
          />

          <ThreeImageWithDescLinkBlock
            firstItem={prepareImageItem(cmsData?.featuredProducts?.products, 0)}
            secondItem={prepareImageItem(
              cmsData?.featuredProducts?.products,
              1
            )}
            thirdItem={prepareImageItem(cmsData?.featuredProducts?.products, 2)}
            linkText={cmsData?.featuredProducts?.footnoteLink?.text}
            linkUrl={cmsData?.featuredProducts?.footnoteLink?.url}
          />

          <LineSeparatorBlock />
        </>
      )}

      <LineSeparatorBlock />

      {cmsData?.ourDesigners && (
        <FourImageBlock
          title={cmsData?.ourDesigners?.title}
          firstItem={prepareImageItem(cmsData?.ourDesigners?.designers, 0)}
          secondItem={prepareImageItem(cmsData?.ourDesigners?.designers, 1)}
          thirdItem={prepareImageItem(cmsData?.ourDesigners?.designers, 2)}
          forthItem={prepareImageItem(cmsData?.ourDesigners?.designers, 3)}
          linkText={cmsData?.ourDesigners?.footnoteLink?.text}
          linkUrl={cmsData?.ourDesigners?.footnoteLink?.url}
        />
      )}

      {cmsData?.exploreFirstProject && (
        <BigImageTitleDescLinkBlock
          title={cmsData?.exploreFirstProject?.title}
          description={cmsData?.exploreFirstProject?.description}
          linkText={cmsData?.exploreFirstProject?.link?.text}
          linkUrl={cmsData?.exploreFirstProject?.link?.url ?? ''}
          image={cmsData?.exploreFirstProject?.image}
          backgroundColor={cmsData?.exploreFirstProject?.backgroundColor}
          textColor="#fff"
        />
      )}

      <EmptySeparatorBlock />

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreAboutUs?.title}
        description={cmsData?.exploreAboutUs?.description}
        linkText={cmsData?.exploreAboutUs?.link?.text}
        linkUrl={cmsData?.exploreAboutUs?.link?.url ?? ''}
        image={cmsData?.exploreAboutUs?.image}
        backgroundColor={cmsData?.exploreAboutUs?.backgroundColor}
        textColor="#6aa6ff"
      />

      <EmptySeparatorBlock />

      {cmsData?.showTimeline ? (
        <div className={cs('witt-container', styles.TimelineWrapper)}>
          <SectionHeader
            text="Explore More on Brown Jordan"
            className={styles.SectionHeader}
          />

          <Timeline />
        </div>
      ) : null}

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreMore?.title}
        description={cmsData?.exploreMore?.description}
        linkText={cmsData?.exploreMore?.link?.text}
        linkUrl={cmsData?.exploreMore?.link?.url ?? ''}
        image={cmsData?.exploreMore?.image}
        backgroundColor={cmsData?.exploreMore?.backgroundColor}
        textColor="#fff"
        fullsizeImage
      />

      {/* <EmptySeparatorBlock /> */}

      <div className={cs('witt-container', styles.BestSellers)}>
        <div className={styles.BestSellersTextWrapper}>
          <SectionHeader
            className={cs(styles.SectionHeader)}
            text={cmsData?.bestSellers?.title}
          />

          <WittLink active href={cmsData?.bestSellers?.link?.url ?? ''}>
            {cmsData?.bestSellers?.link?.text}
          </WittLink>
        </div>
        {cmsData?.bestSellers?.products?.map((item: any) => (
          <Card
            key={getKey(item?.id)}
            title={item?.title || item?.name}
            description={item?.description}
            imageUrl={item?.image}
            ImageElement={
              <div
                className={cs(
                  styles.SanityImageWrapper,
                  'SanityImageWrapperLink'
                )}
                onClick={() =>
                  handleCardImageTitleClicked(item?.link?.url || '/#')
                }
              >
                {item?.image?.asset ? (
                  <SanityImage image={item?.image} />
                ) : null}
              </div>
            }
            isImageVertical
            textLayout="vertical"
            className={cs(styles.CardGridItem, styles.BestSellersGridItem)}
            onClick={() => handleCardImageTitleClicked(item.link.url)}
          />
        )) ?? null}

        <SectionFootnote
          size="medium"
          className={styles.BestSellersTextWrapperBottom}
        >
          <WittLink active href={cmsData?.bestSellers?.link?.url ?? ''}>
            {cmsData?.bestSellers?.link?.text}
          </WittLink>
        </SectionFootnote>
      </div>

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreLocations?.title}
        description=""
        linkText={cmsData?.exploreLocations?.link?.text}
        linkUrl={cmsData?.exploreLocations?.link?.url ?? ''}
        image={cmsData?.exploreLocations?.image}
        backgroundColor={cmsData?.exploreLocations?.backgroundColor}
        textColor="#fff"
        fullsizeImage
        size="medium"
        ratio="55-45"
      />

      {/* <EmptySeparatorBlock /> */}

      <div className={cs('container-with-separator', styles.Lookbooks)}>
        <div
          className={cs(
            styles.SectionHeaderWithLink,
            styles.LoobooksHeaderWrapper
          )}
        >
          <SectionHeader
            text={cmsData?.lookbooks?.title}
            className={cs(styles.SectionHeader, styles.LookbooksSectionHeader)}
          />
          <WittLink
            active
            href={cmsData?.lookbooks?.titleLink?.url ?? ''}
            className={styles.LookbooksSectionLink}
          >
            {cmsData?.lookbooks?.titleLink?.text}
          </WittLink>
        </div>
        <div className={styles.LookbooksGrid}>
          {cmsData?.lookbooks?.selectedLookbooks?.map((item: any) => (
            <Card
              key={getKey(item?.id)}
              title={item?.title || item?.name}
              description={item?.description}
              imageUrl={item.image}
              ImageElement={
                <div
                  className={cs(
                    styles.SanityImageWrapper,
                    'SanityImageWrapperLink'
                  )}
                  onClick={() =>
                    handleCardImageTitleClicked(item?.link?.url ?? '/#')
                  }
                >
                  {item?.image?.asset ? (
                    <SanityImage image={item?.image} />
                  ) : null}
                </div>
              }
              isImageVertical
              textLayout="vertical"
              className={cs(styles.CardGridItem, styles.LookbooksGridItem)}
              onClick={() =>
                handleCardImageTitleClicked(item?.link?.url ?? '/#')
              }
            />
          )) ?? null}
          <WittLink
            active
            href={cmsData?.inTheNews?.titleLink?.url ?? ''}
            className={styles.LookbooksGridLink}
          >
            {cmsData?.inTheNews?.titleLink?.text}
          </WittLink>
        </div>
      </div>
      <div className={cs('witt-container', styles.InTheNews)}>
        <div
          className={cs(
            styles.SectionHeaderWithLink,
            styles.InTheNewsHeaderWrapper
          )}
        >
          <SectionHeader
            text={cmsData?.inTheNews?.title}
            className={styles.SectionHeader}
          />
          <WittLink
            active
            href={cmsData?.inTheNews?.titleLink?.url ?? ''}
            className={styles.InTheNewsHeaderLink}
          >
            {cmsData?.inTheNews?.titleLink?.text}
          </WittLink>
        </div>
        <div className={styles.InTheNewsGrid}>
          {cmsData?.inTheNews?.news?.map((item: any) => (
            <Card
              key={getKey(item?.id)}
              title={item?.title || item?.name}
              description={item?.description}
              imageUrl={item.image}
              ImageElement={
                <div
                  className={cs(
                    styles.SanityImageWrapper,
                    'SanityImageWrapperLink'
                  )}
                  onClick={() =>
                    handleCardImageTitleClicked(item?.link?.url ?? '/#')
                  }
                >
                  {item?.image?.asset ? (
                    <SanityImage image={item?.image} />
                  ) : null}
                </div>
              }
              isImageVertical
              date={transformDateFormat(item?.date)}
              className={cs(styles.CardGridItem, styles.InTheNewsGridItem)}
              onClick={() =>
                handleCardImageTitleClicked(item?.link?.url ?? '/#')
              }
            />
          )) ?? null}
          <WittLink
            active
            href={cmsData?.inTheNews?.titleLink?.url ?? '/#'}
            className={styles.InTheNewsLink}
          >
            {cmsData?.inTheNews?.titleLink?.text}
          </WittLink>
        </div>
      </div>

      {/* <FourImageBlock 
                title={cmsData?.inTheNews?.title}
                firstItem={prepareImageItem(cmsData?.inTheNews?.news, 0)}
                secondItem={prepareImageItem(cmsData?.inTheNews?.news, 1)}
                thirdItem={prepareImageItem(cmsData?.inTheNews?.news, 2)}
                forthItem={prepareImageItem(cmsData?.inTheNews?.news, 3)}
                linkPosition='top'
                linkText={cmsData?.inTheNews?.titleLink?.text}
                linkUrl={cmsData?.inTheNews?.titleLink?.url}
                imageSize='small'
                contentLayout='row'
            /> */}
    </div>
  );
};

export default Home;
