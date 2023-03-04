import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addRoomUser, removeRoomUser} from '../../functions/Room';
import {TTimestampClient} from '../../types/Firebase';
import SmallUserCard from '../cards/SmallUserCard';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  room: {id: string};
  users: {
    id: string;
    displayName: string;
    moment?: {addedAt: TTimestampClient};
  }[];
};

const UsersModal = ({room, users}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  const sortByAddedAt = users.sort((a, b) => {
    if (!a.moment?.addedAt._seconds) {
      return 1;
    }

    if (!b.moment?.addedAt._seconds) {
      return -1;
    }
    return b.moment.addedAt._seconds - a.moment.addedAt._seconds;
  });

  const joined = users.some(({id}) => id === authUserData.id);

  const onJoin = async () => {
    await addRoomUser({room, user: {id: authUserData.id}});
    onUpdate(undefined);
  };
  const onLeave = async () => {
    await removeRoomUser({room, user: {id: authUserData.id}});
    onUpdate(undefined);
  };

  const right = {
    icon: joined ? 'user-minus' : 'user-plus',
    onPress: joined ? onLeave : onJoin,
  };

  return (
    <DefaultModal style={{zIndex: 200}}>
      <DefaultForm
        title={'Users'}
        left={{
          onPress: () => onUpdate(undefined),
        }}
        right={right}>
        <FlatList
          data={sortByAddedAt}
          contentContainerStyle={styles.container}
          keyExtractor={item => item.id}
          indicatorStyle="white"
          showsVerticalScrollIndicator
          ListHeaderComponent={
            <DefaultText
              title="Check who shared most recently!"
              textStyle={{fontWeight: 'bold'}}
              style={{marginBottom: 20}}
            />
          }
          renderItem={({item, index}: {item: TProps['users'][0]}) => {
            return (
              <SmallUserCard
                {...item}
                index={index}
                style={{
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 10,
                }}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default UsersModal;

const styles = StyleSheet.create({
  container: {paddingBottom: 100, paddingHorizontal: 10},
  seperator: {
    marginBottom: 20,
  },
});
