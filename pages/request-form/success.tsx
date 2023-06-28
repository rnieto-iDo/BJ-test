import React from 'react';
import cs from 'classnames';
import styles from '../../styles/pages/RequestForm.module.scss';
import SeoMetaData from '../../components/globals/SeoMetaData';

const Custom404 = () =>  (
    <div className={styles.RequestFormSuccess}>
            <SeoMetaData />

            <div className={cs('content')} >
            <div id="title">
                <h1 className={cs('title')}>
                    {`Thank you!`}
                </h1>
            </div>
            <div id="description">
                <h1 className={cs('description')}>
                    {`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Metus non venenatis viverra cras. Netus porttitor egestas id etiam maecenas.
                      Leo egestas donec consequat sed elementum et.`}
                </h1>
            </div>
        </div>
    </div>
);

export default Custom404;
