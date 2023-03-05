import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import CreateRoomButton from '../buttons/CreateRoomButton';
import ChannelSummary from './ChannelSummary';

type TProps = {
  style: TStyleView;
};

const Channels = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const renderItem = ({item}) => {
    return <ChannelSummary channel={{id: item.id}} />;
  };

  return (
    <View style={style}>
      <FlatList
        data={authUserData.inviteFrom.items}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        indicatorStyle="white"
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <View style={styles.footer}>
        <CreateRoomButton style={styles.create} />
      </View>
    </View>
  );
};

export default Channels;

const styles = StyleSheet.create({
  contentContainer: {paddingBottom: 100},
  seperator: {
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  create: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
  },
});
