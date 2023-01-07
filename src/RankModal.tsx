import React from 'react';
import {Text} from 'react-native';
import DefaultModal from './DefaultModal';

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
      <Text>Daily Rank</Text>
    </DefaultModal>
  );
};

export default RankModal;
