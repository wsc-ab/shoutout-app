import React from 'react';
import DefaultModal from './DefaultModal';
import DefaultText from './DefaultText';

type TProps = {
  onCancel: () => void;
};

const RankModal = ({onCancel}: TProps) => {
  return (
    <DefaultModal
      title="Ranking"
      left={{
        title: 'Cancel',
        onPress: onCancel,
      }}>
      <DefaultText title="Ranks" />
    </DefaultModal>
  );
};

export default RankModal;
