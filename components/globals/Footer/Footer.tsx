import {
  Footer as WittFooter,
  Modal
} from '@witt-team/athens-component-library';
import { useEffect, useState } from 'react';
import HubspotForm from 'react-hubspot-form';

import Facebook from '../../../assets/facebook.svg';
import Houzz from '../../../assets/houzz.svg';
import Instagram from '../../../assets/instagram.svg';
import LinkedIn from '../../../assets/linkedin.svg';
import Logo from '../../../assets/Logo.svg';
import Pinterest from '../../../assets/pinterest.svg';
import Twitter from '../../../assets/twitter.svg';
import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';
import {
  getFooterContent,
  selectFooterCmsData
} from '../../../store/reducers/pageSlice';
import styles from './Footer.module.scss';

type Link = {
  text: string;
  url: string;
};

type SocialMediaLink = {
  iconUrl: string;
  linkUrl: string;
};

const Footer = () => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectFooterCmsData);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getFooterContent());
  }, [dispatch]);

  const handleToggleDialog = () => setIsOpen(prev => !prev);
  const getPageLinks = (pageLinks: any[]): Link[] => {
    const links: Link[] = [];
    if (!pageLinks) {
      return links;
    }

    pageLinks?.forEach((item: Link) => {
      if (item?.text && item?.url) {
        links.push({ text: item.text, url: item.url });
      }
    });
    return links;
  };

  const getSocialMediaLinks = (icons: any[]): SocialMediaLink[] => {
    const links: SocialMediaLink[] = [];
    if (!icons) {
      return links;
    }
    icons?.forEach((item: any) => {
      if (item?.icon && item?.link) {
        switch (item?.icon) {
          case 'facebook':
            links.push({
              iconUrl: Facebook.src.toString(),
              linkUrl: item?.link?.url
            });
            break;
          case 'twitter':
            links.push({
              iconUrl: Twitter.src.toString(),
              linkUrl: item?.link?.url
            });
            break;
          case 'instagram':
            links.push({
              iconUrl: Instagram.src.toString(),
              linkUrl: item?.link?.url
            });
            break;
          case 'houzz':
            links.push({
              iconUrl: Houzz.src.toString(),
              linkUrl: item?.link?.url
            });
            break;
          case 'pinterest':
            links.push({
              iconUrl: Pinterest.src.toString(),
              linkUrl: item?.link?.url
            });
            break;
          case 'linkedin':
            links.push({
              iconUrl: LinkedIn.src.toString(),
              linkUrl: item?.link?.url
            });
            break;
          default:
            break;
        }
      }
    });
    return links;
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleToggleDialog} title="Newsletter">
        <HubspotForm
          portalId="3029699"
          formId="d2afaa55-270d-4b62-82f6-1573a5a3b5cc"
          onSubmit={() => handleToggleDialog()}
          onReady={() => console.log('Form ready!')}
          loading={<div>Loading...</div>}
        />
      </Modal>

      <WittFooter
        className={styles.FooterBar}
        pageLinks={getPageLinks(cmsData?.links)}
        imageUrl={Logo.src}
        onSubmit={handleToggleDialog}
        text={cmsData?.text}
        socialMediaLinks={getSocialMediaLinks(cmsData?.socialIcons)}
      />
    </div>
  );
};

export default Footer;
