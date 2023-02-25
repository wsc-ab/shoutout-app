import React, {useContext} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TDocData} from '../../types/Firebase';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import RoomCard from '../screen/RoomCard';

type TProps = {
  room: TDocData;
  path?: string;
};

const RoomModal = ({room, path}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {height, width} = useWindowDimensions();

  console.log(path, 'p');

  return (
    <DefaultModal>
      <RoomCard
        room={room}
        path={path}
        mount
        pauseOnModal={false}
        style={[styles.card, {height, width}]}
      />
      <DefaultIcon
        icon="angle-left"
        style={styles.icon}
        onPress={() => {
          onUpdate(undefined);
        }}
      />
    </DefaultModal>
  );
};

export default RoomModal;

const styles = StyleSheet.create({
  icon: {top: 40, zIndex: 300, position: 'absolute', padding: 20},
  card: {flex: 1, position: 'absolute'},
});
