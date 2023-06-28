import { WittLink } from '@witt-team/athens-component-library';
import React, { FC } from 'react';
import cs from 'classnames';

import styles from './Contact.module.scss';

type ContactProps = {
  name: string;
  value: string;
  isEmail?: boolean;
  isPhoneNumber?: boolean;
  link?: {
    url: string;
    text: string;
  };
};

const Contact: FC<ContactProps> = ({
  name,
  value,
  isEmail,
  isPhoneNumber,
  link
}) => (
  <div className={styles.Contact}>
    <p className={styles.ContactName}>{name}</p>
    <div className={styles.ContactContainer}>
      {isEmail || isPhoneNumber ? (
        <WittLink
          className={cs(
            styles.ContactLink,
            isEmail ?? styles.isEmail,
            isPhoneNumber ?? styles.isPhoneNumber
          )}
          href={
            isEmail
              ? `mailto:${value}`
              : isPhoneNumber
              ? `tel:${value}`
              : link?.url
              ? link?.url
              : '/#'
          }
        >
          {link?.text ? link?.text : value}
        </WittLink>
      ) : (
        <p className={styles.ContactValue}>{value}</p>
      )}
      {link && link?.text && link?.url && (
        <WittLink href={link?.url} className={styles.RetailersLink}>
          {link?.text}
        </WittLink>
      )}
    </div>
  </div>
);

Contact.defaultProps = {
  link: undefined
};

export default Contact;
