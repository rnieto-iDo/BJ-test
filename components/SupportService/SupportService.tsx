import React, { FC } from 'react';
import Contact from './Contact/Contact';

import styles from './SupportService.module.scss';

type SupportServiceProps = {
  name: string;
  contacts: Array<any>;
};

const SupportService: FC<SupportServiceProps> = ({ name, contacts }) => (
  <div className={styles.SupportService}>
    <p className={styles.ServiceName}>{name}</p>
    <p>
      {contacts?.map(
        (contact: {
          name: string;
          value: string;
          isEmail?: boolean;
          isPhoneNumber?: boolean;
          link: {
            url: string;
            text: string;
          };
        }) => (
          <Contact
            name={contact.name}
            value={contact.value}
            link={contact.link}
            isEmail={contact.isEmail}
            isPhoneNumber={contact.isPhoneNumber}
          />
        )
      )}
    </p>
  </div>
);

export default SupportService;
