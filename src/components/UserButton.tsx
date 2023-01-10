import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../types/style';
import DefaultIcon from './DefaultIcon';
import UserModal from './UserModal';

type TProps = {style: TStyleView};

const UserButton = ({style}: TProps) => {
  const [modal, setModal] = useState<'me'>();

  return (
    <View style={style}>
      <DefaultIcon
        icon="user"
        onPress={() => setModal('me')}
        style={styles.icon}
      />
      {modal === 'me' && <UserModal onCancel={() => setModal(undefined)} />}
    </View>
  );
};

export default UserButton;

const styles = StyleSheet.create({icon: {alignItems: 'flex-start'}});
