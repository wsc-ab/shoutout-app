import React, {useContext} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import CreateRoomButton from '../buttons/CreateRoomButton';
import InviteCard from '../cards/InviteCard';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import RoomSummary from './RoomSummary';

type TProps = {
  style: TStyleView;
};

const Rooms = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const renderItem = ({item}) => {
    return <RoomSummary room={{id: item}} style={{marginHorizontal: 10}} />;
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          marginHorizontal: 10,
        }}>
        <DefaultText
          title="Rooms with friends, without ghosting"
          numberOfLines={2}
          textStyle={{fontWeight: 'bold', fontSize: 20}}
        />
        <DefaultText
          title="Create rooms with friends to share live moments."
          style={{marginTop: 40}}
          textStyle={{fontWeight: 'bold'}}
          numberOfLines={2}
        />
        <DefaultText
          title="You need to have shared within the last 24 hours to view other moments in the room."
          style={{marginTop: 40}}
          textStyle={{fontWeight: 'bold'}}
          numberOfLines={2}
        />
        <InviteCard
          style={{backgroundColor: defaultBlack.lv2(1), marginTop: 40}}
        />
      </View>
    );
  };

  return (
    <View style={style}>
      <FlatList
        data={authUserData.inviteFrom.items.map(({id: elId}) => elId)}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        indicatorStyle="white"
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <View style={styles.footer}>
        <CreateRoomButton style={styles.create} />
      </View>
    </View>
  );
};

export default Rooms;

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
