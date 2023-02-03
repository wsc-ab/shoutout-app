import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import UserModal from '../modals/AuthUserModal';

type TProps = {
  style: TStyleView;
};

const UserButton = ({style}: TProps) => {
  const {onUpdate, modal} = useContext(ModalContext);

  return (
    <View style={style}>
      <DefaultIcon
        icon="user"
        size={20}
        onPress={() => {
          onUpdate('me');
        }}
        style={styles.icon}
      />
      {modal === 'me' && (
        <UserModal
          onCancel={() => {
            console.log('called');

            onUpdate(undefined);
          }}
        />
      )}
    </View>
  );
};

export default UserButton;

const styles = StyleSheet.create({icon: {alignItems: 'flex-start'}});
