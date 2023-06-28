/* eslint-disable arrow-body-style */
import { Button } from '@witt-team/athens-component-library';
import React, { FC } from 'react';

import styles from './MoodboardConfiguratorControls.module.scss';

type MoodboardConfiguratorControlsProps = {
  onCancelClicked: () => void;
  onDoneClicked: () => void;
};

const MoodboardConfiguratorControls: FC<MoodboardConfiguratorControlsProps> = ({
  onCancelClicked,
  onDoneClicked
}) => {
  return (
    <div className={styles.MoodboardConfiguratorControls}>
      <Button onClick={onDoneClicked} size="full-width" variant="filled">
        Done
      </Button>
      <Button
        className={styles.CancelButton}
        size="full-width"
        variant="default"
        onClick={onCancelClicked}
      >
        Cancel
      </Button>
    </div>
  );
};

export default MoodboardConfiguratorControls;
