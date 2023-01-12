import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import UserModal from '../modals/AuthUserModal';

type TProps = {style: TStyleView; onModal: (visible: boolean) => void};

const UserButton = ({style, onModal}: TProps) => {
  const [modal, setModal] = useState<'me'>();

  return (
    <View style={style}>
      <DefaultIcon
        icon="user"
        onPress={() => {
          onModal(true);
          setModal('me');
        }}
        style={styles.icon}
      />
      {modal === 'me' && (
        <UserModal
          onCancel={() => {
            onModal(false);
            setModal(undefined);
          }}
        />
      )}
    </View>
  );
};

export default UserButton;

const styles = StyleSheet.create({icon: {alignItems: 'flex-start'}});
