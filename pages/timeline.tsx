import { ExploreSection } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import SeoMetaData from '../components/globals/SeoMetaData';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import {
  getTimelinePageContent,
  selectCMSData
} from '../store/reducers/pageSlice';
import styles from '../styles/pages/Timeline.module.scss';

const YEARS = [1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

const Locations = () => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);
  const [activeDecade, setActiveDecade] = useState(YEARS[0]);
  const [yearsLength, setYearsLength] = useState(0);

  const inputRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    dispatch(getTimelinePageContent());
  }, [dispatch]);

  useEffect(() => {
    const totalYears = cmsData?.timeline?.length;
    setYearsLength(totalYears);
  }, [cmsData]);

  useEffect(() => {
    const allRefs = inputRef.current;
    if (allRefs.length > 0) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio > 0.27) {
              const element: HTMLDivElement = entry?.target as HTMLDivElement;
              const intersectedDecade: number = Number(
                element?.dataset?.decade
              ) as number;
              entry.target.classList.remove('hide-element');
              setActiveDecade(intersectedDecade);
            } else {
              entry.target.classList.add('hide-element');
            }
          });
        },
        {
          threshold: Array(11)
            .fill(1)
            .map((_, i) => i * 0.1)
        }
      );
      allRefs.forEach(ref => ref && observer.observe(ref));
    }
  }, [yearsLength]);

  return (
    <section className={styles.Timeline}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.introSection?.title}
        description={cmsData?.introSection?.description}
        backgroundColor={cmsData?.introSection?.backgroundColor?.hex}
        textColor="#fff"
        size="medium"
      />
      <div
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const inputElement: HTMLInputElement = e.target as HTMLInputElement;
          const targetRef = inputRef.current.find(
            (ref: any) => ref?.dataset.decade === inputElement.value
          ) as HTMLDivElement | undefined;
          if (targetRef) targetRef.scrollIntoView();
        }}
        className={styles.TimelineNavigation}
      >
        {YEARS.map(year => (
          <div>
            <input
              type="radio"
              value={year}
              name="year"
              id={`${year}`}
              checked={activeDecade === year}
            />
            <label htmlFor={`${year}`}>
              <p>{year}s</p>
            </label>
          </div>
        ))}
      </div>

      <div className={styles.TimelineContainer}>
        {cmsData?.timeline.map((timelineModule: any, i: number) => {
          const decade = timelineModule.value;

          return (
            <div
              data-decade={decade}
              ref={el => {
                inputRef.current[i] = el;
              }}
              className={cs('hide-element', 'timeline-decade')}
            >
              {timelineModule.timelineItems.map(
                ({
                  backgroundColor,
                  description,
                  image,
                  layout,
                  title,
                  year
                }) => (
                  <div className={cs(styles.TimelineItem, layout)} key={title}>
                    <p className={styles.TimelineYear}>{year}</p>
                    <ExploreSection
                      title={title}
                      description={description}
                      link={{ url: '', text: '' }}
                      imageUrl={image || '/'}
                      className={!image ? styles.NoImage : ''}
                      backgroundColor={backgroundColor?.hex || ''}
                    />
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Locations;
