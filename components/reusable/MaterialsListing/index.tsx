import { Card, Button } from '@witt-team/athens-component-library';
import { Tabs, TabsProps } from 'antd';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { getKey } from '../../../utils';
import styles from './MaterialsListing.module.scss';

type Materials = {
  categoryName: string;
  categoryArray: any[];
};

type MaterialListingPropType = {
  title: string;
  subTitle: string;
  materials: Materials[];
};

const MaterialsListing: FC<MaterialListingPropType> = ({
  title,
  subTitle,
  materials
}) => {
  const router = useRouter();

  const renderGrid = (array: any[]) => (
    <div>
      <div className={styles.Grid}>
        {array?.map(item => (
          <Card
            key={getKey('material-listing-')}
            title={item?.name}
            imageUrl={item?.media_gallery[0]?.url ?? item?.image?.url}
            className={styles.GridElement}
            onClick={() => router.push(`/materials/${item?.url_key}`)}
          />
        ))}
      </div>
      <div className={styles.SeeAll}>
        <Button className={styles.Button} variant="outlined" size="small">
          See All
        </Button>
      </div>
    </div>
  );

  const tabItems: TabsProps['items'] = materials?.map((item, index): any => ({
    key: index,
    label: item?.categoryName,
    children: renderGrid(item?.categoryArray)
  }));

  return (
    <div className={styles.Main}>
      <div className={styles.TitleContainer}>
        <p className={styles.Title}>{title}</p>
        <div className={styles.SubTitle}>{subTitle}</div>
      </div>
      <Tabs items={tabItems} className={styles.Tabs} />
    </div>
  );
};

export default MaterialsListing;
