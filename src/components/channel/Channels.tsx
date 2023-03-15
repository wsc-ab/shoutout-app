import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';

import Channel from '../channel/Channel';

import EmptyChannel from './EmptyChannel';
import PlusChannelButton from './PlusChannelButton';

type TProps = {
  style: TStyleView;
};

const Channels = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const renderItem = ({item}: {item: {id: string}}) => (
    <Channel channel={{id: item.id}} />
  );

  return (
    <View style={style}>
      <FlatList
        data={authUserData.inviteFrom.items}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        indicatorStyle="white"
        ListEmptyComponent={EmptyChannel}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <View style={styles.footer}>
        <PlusChannelButton style={styles.button} />
      </View>
    </View>
  );
};

export default Channels;

const styles = StyleSheet.create({
  contentContainer: {paddingBottom: 100, paddingHorizontal: 20},
  seperator: {
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 5,
  },
  button: {
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: 'gray',
    borderRadius: 20,
  },
});
