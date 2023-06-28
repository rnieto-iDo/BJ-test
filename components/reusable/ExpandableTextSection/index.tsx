import { FC, useState } from 'react';
import cs from 'classnames';
import Image from 'next/image';
import styles from './ExpandableTextSection.module.scss';
import { SanityImage } from '../SanityImage/SanityImage';

type ExpandableTextSectionPropTypes = {
  image: any;
  title: string;
  description: string;
  className?: string;
};

const ExpandableTextSection: FC<ExpandableTextSectionPropTypes> = ({
  image,
  title,
  description,
  className
}) => {
  const [expandText, setExpandText] = useState<boolean>(false);

  const truncateString = (text: string) =>
    text?.length > 800 ? `${text?.slice(0, 800)}...` : text;

  return (
    <div className={cs(styles.Main, className)}>
      <div className={styles.Image}>
        {image?.asset ? (
          <SanityImage image={image} />
        ) : (
          <Image src={image} alt="no-image" fill />
        )}
      </div>
      <div className={styles.Content}>
        <p className={styles.Title}>{title}</p>
        <div>
          <p className={styles.Description}>
            {!expandText ? truncateString(description) : description}
          </p>
          {description?.length > 800 && (
            <div
              className={styles.ViewMoreButton}
              onClick={() => setExpandText(!expandText)}
            >
              {!expandText ? 'View More' : 'View Less'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ExpandableTextSection.defaultProps = {
  className: ''
};

export default ExpandableTextSection;
