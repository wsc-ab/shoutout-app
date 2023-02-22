import React, {useContext} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import ModalContext from '../../contexts/Modal';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import PromptCard from '../screen/PromptCard';

type TProps = {
  id: string;
  path?: string;
};

const PromptModal = ({id, path}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {height, width} = useWindowDimensions();

  return (
    <DefaultModal>
      <PromptCard
        prompt={{id}}
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

export default PromptModal;

const styles = StyleSheet.create({
  icon: {top: 40, zIndex: 300, position: 'absolute'},
  card: {flex: 1, position: 'absolute'},
});
