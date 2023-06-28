import React, { FC } from 'react';
import Link from 'next/link';
import styles from './LoginPopup.module.scss';

type LoginPopupProps = {
  onClose: () => void;
};

const LoginPopup: FC<LoginPopupProps> = ({ onClose }) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div id="login-popup" className={styles.PopupOverlay}>
      <div className={styles.PopupContainer}>
        <div>
          <h1>Please login to download assets.</h1>
          <p>
            <Link href="/login">Login</Link> or{' '}
            <Link href="/#">Create an Account</Link>
          </p>
        </div>
        <div>
          <button
            type="button"
            className={styles.Button}
            onClick={handleOnClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
