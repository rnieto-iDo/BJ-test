/* eslint-disable jsx-a11y/media-has-caption */
import { FC } from 'react';
// eslint-disable-next-line import/no-unresolved
import MuxPlayer from '@mux/mux-player-react';
import cs from 'classnames';

import styles from './VideoPlayer.module.scss';

type VideoPlayerProps = {
  playbackId: string;
  className: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

const VideoPlayer: FC<VideoPlayerProps> = ({
  playbackId,
  className,
  autoPlay,
  muted = true,
  loop = true,
  controls = false
}) => (
  <MuxPlayer
    playbackId={playbackId}
    className={cs(
      styles.MuxPlayer,
      className,
      !controls ? styles.MuxPlayerNoControls : ''
    )}
    autoPlay={autoPlay}
    muted={muted}
    loop={loop}
    preload="auto"
  />
);

VideoPlayer.defaultProps = {
  autoPlay: true,
  loop: true
};
export default VideoPlayer;
