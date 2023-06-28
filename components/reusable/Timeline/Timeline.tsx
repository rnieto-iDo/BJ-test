import { WittLink } from "@witt-team/athens-component-library";
import { useEffect } from "react";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../hooks/reduxOverwriteHooks";
import {
    getTimelineContent,
    selectTimelineData,
} from "../../../store/reducers/pageSlice";

import styles from "./Timeline.module.scss";

const Timeline = () => {
    const dispatch = useAppDispatch();
    const cmsData = useAppSelector(selectTimelineData);

    useEffect(() => {
        dispatch(getTimelineContent());
    }, [dispatch]);

    return (
        <div className={styles.Timeline}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={cmsData?.image ?? ""}
                alt="not-loaded"
                className={styles.TimelineImage}
            />
            <div className={styles.OverlappingTextWrapper}>
                <p className={styles.TimelineText}>{cmsData?.text}</p>
                <WittLink
                    className={styles.TimelineLink}
                    href={cmsData?.link?.url ?? ""}
                >
                    {cmsData?.link?.text}
                </WittLink>
            </div>
        </div>
    );
};

export default Timeline;
