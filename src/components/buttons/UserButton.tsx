import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import UserModal from '../modals/AuthUserModal';

type TProps = {
  style: TStyleView;
  changeModalVisible: (visible: boolean) => void;
};

const UserButton = ({style, changeModalVisible}: TProps) => {
  const [modal, setModal] = useState<'me'>();

  return (
    <View style={style}>
      <DefaultIcon
        icon="user"
        onPress={() => {
          changeModalVisible(true);
          setModal('me');
        }}
        style={styles.icon}
      />
      {modal === 'me' && (
        <UserModal
          onCancel={() => {
            changeModalVisible(false);
            setModal(undefined);
          }}
        />
      )}
    </View>
  );
};

export default UserButton;

const styles = StyleSheet.create({icon: {alignItems: 'flex-start'}});
