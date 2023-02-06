import React from 'react';
import {StyleSheet} from 'react-native';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import MomentCard from '../screen/MomentCard';

type TProps = {
  roll: {id: string};
  onCancel: () => void;
};

const RollModal = ({roll: {id}, onCancel}: TProps) => {
  return (
    <DefaultModal>
      <DefaultIcon
        icon="angle-left"
        style={{top: 40, zIndex: 100}}
        onPress={onCancel}
      />
      <MomentCard
        moment={{id}}
        inView={true}
        style={{top: 0, left: 0, right: 0, position: 'absolute'}}
      />
    </DefaultModal>
  );
};

export default RollModal;

const styles = StyleSheet.create({});
