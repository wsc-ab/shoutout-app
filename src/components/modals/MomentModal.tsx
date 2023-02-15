import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import MomentCard from '../screen/MomentCard';

type TProps = {
  id: string;
  path?: string;
};

const MomentModal = ({id, path}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <DefaultModal>
      <DefaultIcon
        icon="angle-left"
        style={styles.icon}
        onPress={() => {
          onUpdate(undefined);
        }}
      />
      <MomentCard
        moment={{id}}
        pauseOnModal={false}
        style={styles.card}
        path={path}
        mount
        inView
      />
    </DefaultModal>
  );
};

export default MomentModal;

const styles = StyleSheet.create({
  icon: {top: 40, zIndex: 200},
  card: {top: 0, left: 0, right: 0, position: 'absolute'},
});
