import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import CreateButton from './CreateButton';
import RankingModal from './RankingModal';
import UserModal from './UserModal';

const Header = () => {
  const [modal, setModal] = useState<'me' | 'ranking'>();

  const hideModal = () => setModal(undefined);

  return (
    <View style={styles.container}>
      <DefaultText
        title="Me"
        onPress={() => setModal('me')}
        style={styles.left}
      />

      <DefaultText
        title="Ranking"
        onPress={() => setModal('ranking')}
        style={styles.center}
      />
      <CreateButton style={styles.right} />

      {modal === 'me' && <UserModal onCancel={hideModal} />}
      {modal === 'ranking' && <RankingModal onCancel={hideModal} />}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  left: {flex: 1, alignItems: 'flex-start'},
  center: {flex: 1, alignItems: 'center'},
  right: {flex: 1, alignItems: 'flex-end'},
});
