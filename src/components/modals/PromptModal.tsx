import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
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

  return (
    <DefaultModal>
      <DefaultIcon
        icon="angle-left"
        style={styles.icon}
        onPress={() => {
          onUpdate(undefined);
        }}
      />
      <PromptCard
        prompt={{id}}
        pauseOnModal={false}
        style={styles.card}
        path={path}
        mount
        inView
      />
    </DefaultModal>
  );
};

export default PromptModal;

const styles = StyleSheet.create({
  icon: {top: 40, zIndex: 200},
  card: {top: 0, left: 0, right: 0, position: 'absolute'},
});
