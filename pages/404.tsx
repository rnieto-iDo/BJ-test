import React from 'react';
import cs from 'classnames';
import styles from '../styles/pages/404.module.scss';
import SeoMetaData from '../components/globals/SeoMetaData';

const Custom404 = () =>  (
    <div className={styles.Custom404}>
            <SeoMetaData />

            <div className={cs('content')} >
            <div id="title">
                <h1 className={cs('title')}>Oops! Page not Found</h1>
            </div>
            <div id="description">
                <h1 className={cs('description')}>The page you are looking for doesn’t exist or an other error occurred. Go back, or head over to brownjordan.com to explore other collections.</h1>
            </div>
        </div>
    </div>
);

export default Custom404;
