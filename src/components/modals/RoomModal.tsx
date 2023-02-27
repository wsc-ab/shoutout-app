import React, {useContext} from 'react';
import {SafeAreaView, StyleSheet, useWindowDimensions} from 'react-native';
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

  return (
    <DefaultModal>
      <SafeAreaView style={styles.view}>
        <DefaultIcon
          icon="angle-left"
          style={styles.icon}
          onPress={() => {
            onUpdate(undefined);
          }}
        />
      </SafeAreaView>
      <RoomCard
        room={room}
        path={path}
        mount
        pauseOnModal={false}
        style={[styles.card, {height, width}]}
      />
    </DefaultModal>
  );
};

export default RoomModal;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    zIndex: 100,
  },
  icon: {padding: 10},
  card: {flex: 1, position: 'absolute'},
});
