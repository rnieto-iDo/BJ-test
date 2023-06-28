import { useAppDispatch, useAppSelector } from 'hooks/reduxOverwriteHooks';
import { useEffect } from 'react';
import {
  getRegisterPageContent,
  selectRegisterPageCmsData
} from 'store/reducers/pageSlice';
import styles from '../../styles/pages/RegisterSuccess.module.scss';

const RegisterSuccess = () => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectRegisterPageCmsData);

  useEffect(() => {
    dispatch(getRegisterPageContent());
  }, [dispatch]);

  return (
    <div className={styles.Main}>
      <div className={styles.Content}>
        <p className={styles.Title}>{cmsData?.successPageContent?.title}</p>
        <p className={styles.SubTitle}>
          {cmsData?.successPageContent?.subTitle}
        </p>
      </div>
    </div>
  );
};

export default RegisterSuccess;
