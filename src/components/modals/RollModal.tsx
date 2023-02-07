import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import MomentCard from '../screen/MomentCard';

type TProps = {
  id: string;
};

const RollModal = ({id}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <DefaultModal>
      <DefaultIcon
        icon="angle-left"
        style={styles.icon}
        onPress={() => onUpdate(undefined)}
      />
      <MomentCard moment={{id}} inView={true} style={styles.card} />
    </DefaultModal>
  );
};

export default RollModal;

const styles = StyleSheet.create({
  icon: {top: 40, zIndex: 100},
  card: {top: 0, left: 0, right: 0, position: 'absolute'},
});
