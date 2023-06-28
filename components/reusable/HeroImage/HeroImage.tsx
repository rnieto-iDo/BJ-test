import React, { FC } from 'react';
import cs from 'classnames';
import { SanityImage } from '../SanityImage/SanityImage';
import styles from './HeroImage.module.scss';

type HeroImageProps = {
    className: string;
    backgroundImage: any;
    title: string;
    additionalText: string;
    additionalTextLink?: string;
    video?: React.ReactNode;
};

const HeroImage: FC<HeroImageProps> = ({ backgroundImage, className, title, additionalText, additionalTextLink, video }) => (
    <div className={cs(styles.HeroImage, className)}>
        {video && Object.prototype.hasOwnProperty.call(video, 'props') ? video : backgroundImage?.asset ? <SanityImage image={backgroundImage} /> : null}
        <div className={styles.TextContainer}>
            <h1 id="head-image-title" className={styles.Title}>
                {title}
            </h1>
            {additionalTextLink ? (
                <p className={styles.AdditionalText}>
                    <a href={additionalTextLink}>{additionalText}</a>
                </p>
            ) : (
                <p className={styles.AdditionalText}>{additionalText}</p>
            )}
        </div>
    </div>
);

HeroImage.defaultProps = {
    video: undefined,
    additionalTextLink: undefined,
};

export default HeroImage;
