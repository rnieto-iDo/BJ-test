import { SearchBar, SectionHeader } from '@witt-team/athens-component-library';
import cs from 'classnames';
import { FC } from 'react';

import { representativesPageQuery } from '../../api/queries/pages.queries';
import { usePreview } from '../../hooks/usePreview';
import styles from '../../styles/pages/Representatives.module.scss';

type RepresentativesPagePreviewProps = {
    searchValue: string;
    sortValue: string;
    setSearchValue: (text: string) => void;
    setSortValue: (value: string) => void;
    doFilter: (item: any) => void;
};

const RepresentativesPagePreview: FC<RepresentativesPagePreviewProps> = ({ searchValue, sortValue, setSearchValue, setSortValue, doFilter }) => {
    const cmsData = usePreview(null, representativesPageQuery);

    return (
        <div className={styles.Representatives}>
            <div className={styles.PageCover}>
                <div className={styles.TextContainer}>
                    <h1 className={styles.Title}>{cmsData?.title}</h1>
                    <p className={styles.AdditionalText}>{cmsData?.description}</p>
                </div>
            </div>
            <SearchBar
                className={cs('container', styles.SearchBarContainer)}
                searchBarValue={searchValue}
                selectDefaultValue={sortValue}
                onSearchBarChange={text => setSearchValue(text)}
                selectOptions={[]}
                onSelectChange={value => setSortValue(value)}
            />
            <div className={cs('container', styles.RepresentativesContainer)}>
                <SectionHeader text="United States" />
                {cmsData?.representatives?.us.filter(doFilter).map((item: any) => (
                    <div key={item?.id} className={styles.Representative}>
                        <div className={styles.Location}>{item?.location}</div>
                        <div className={styles.Info}>
                            <p className={styles.Name}>{item?.name}</p>
                            <p className={styles.Description}>{item?.description}</p>
                        </div>
                        <div className={styles.Contact}>
                            <p>P: {item?.phone}</p>
                            <p>F: {item?.fax}</p>
                            <p>{item?.mail}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={cs('container', styles.RepresentativesContainer, styles.RepresentativesContainerIntenational)}>
                <SectionHeader text="Intenational" />
                {cmsData?.representatives?.international.filter(doFilter).map((item: any) => (
                    <div key={item?.id} className={styles.Representative}>
                        <div className={styles.Location}>{item?.location}</div>
                        <div className={styles.Info}>
                            <p className={styles.Name}>{item?.name}</p>
                            <p className={styles.Description}>{item?.description}</p>
                        </div>
                        <div className={styles.Contact}>
                            <p>P: {item?.phone}</p>
                            <p>F: {item?.fax}</p>
                            <p>{item?.mail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RepresentativesPagePreview;
