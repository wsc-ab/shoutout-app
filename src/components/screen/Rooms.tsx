import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
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
    return <RoomSummary room={{id: item}} style={undefined} />;
  };

  const ListEmptyComponent = () => {
    return (
      <View style={{marginHorizontal: 10}}>
        <InviteCard style={{backgroundColor: defaultBlack.lv2(1)}} />
        <DefaultText
          title="No room has been found."
          style={{marginTop: 10}}
          textStyle={{fontWeight: 'bold'}}
        />
        <DefaultText
          title="Invite friends and start connecting live moments!"
          style={{marginTop: 10}}
          textStyle={{fontWeight: 'bold'}}
        />
      </View>
    );
  };

  return (
    <View style={style}>
      <FlatList
        data={authUserData.inviteFrom.ids}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <CreateRoomButton
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          marginHorizontal: 20,
        }}
      />
    </View>
  );
};

export default Rooms;

const styles = StyleSheet.create({
  contentContainer: {paddingTop: 100, paddingBottom: 150},
  seperator: {
    marginVertical: 20,
  },
});
