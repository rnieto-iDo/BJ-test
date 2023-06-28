import { Accordion, WittLink } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import TextWithButtonBlock from 'blocks/text-blocks/text-with-button-block/TextWithButtonBlock';
import cs from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SeoMetaData from '../../components/globals/SeoMetaData';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getFaqPageContent,
  selectFaqCmsData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/support/Faq.module.scss';
import { getKey } from '../../utils';

type ChildrenType = {
  text: string;
  _type: string;
  _key: string;
  marks: string[];
};

type MarkDefType = {
  _key: string;
  _type: string;
  href: string;
};

type AnswerType = {
  children: ChildrenType[];
  markDefs: MarkDefType[];
};

type FaqProps = {
  question: string;
  answer: AnswerType[];
};

type FaqGroupProps = {
  id: string;
  title: string;
  slug: string;
  faqs: FaqProps[];
};

const Faq = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cmsData = useAppSelector(selectFaqCmsData);
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = linkId => {
    setActiveLink(linkId);
  };

  const handleButtonClick = (href: string) => {
    if (href) router.push(href);
  };

  const renderLinks = (link: ChildrenType, markDefs: MarkDefType[]) => {
    const url =
      // eslint-disable-next-line no-underscore-dangle
      markDefs?.find(item => item?._key === link?.marks[0])?.href || '#';

    return <WittLink href={url}>{link?.text}</WittLink>;
  };

  const renderText = (faq: FaqProps) => {
    const markDefs = faq?.answer[0]?.markDefs;
    const children = faq?.answer[0]?.children;

    return children?.map(item => {
      // eslint-disable-next-line no-underscore-dangle
      if (!item?.marks?.find(mark => markDefs?.find(el => el?._key === mark))) {
        return item?.text;
      }
      return renderLinks(item, markDefs);
    });
  };

  useEffect(() => {
    dispatch(getFaqPageContent());
  }, [dispatch]);

  return (
    <div className={styles.Faqs}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        backgroundColor={cmsData?.introExploreSection?.backgroundColor}
        title={cmsData?.introExploreSection?.title}
        textColor="#fff"
        size="medium"
        className={styles.IntroExploreSection}
      />
      <div className={cs('witt-container', styles.FaqsContainer)}>
        <div className={styles.Menu}>
          {cmsData?.faqGroups?.map((group: FaqGroupProps) => (
            <div key={getKey('faq-menu-')}>
              <Link
                href={`#${group?.slug}`}
                className={activeLink === group?.slug ? 'active' : ''}
                onClick={() => handleLinkClick(group?.slug)}
              >
                {group?.title}
              </Link>
            </div>
          ))}
        </div>
        <div key={getKey('groups-')} className={styles.Groups}>
          {cmsData?.faqGroups?.map((group: FaqGroupProps) => (
            <div key={getKey('group-')} className={styles.GroupContainer}>
              <div id={group?.slug} className={styles.Title}>
                {group?.title}
              </div>
              <div className={styles.FaqList}>
                {group.faqs?.map((faq: FaqProps) => (
                  <div key={getKey('faq-')} className={styles.Faq}>
                    <Accordion
                      label={faq?.question ?? ''}
                      className={styles.Accordion}
                    >
                      {renderText(faq)}
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {cmsData?.footerExploreSection ? (
        <TextWithButtonBlock
          text={cmsData?.footerExploreSection?.title}
          buttonLabel={cmsData?.footerExploreSection?.link?.text}
          buttonClick={() =>
            handleButtonClick(cmsData?.footerExploreSection?.link?.url)
          }
        />
      ) : null}
    </div>
  );
};

export default Faq;
