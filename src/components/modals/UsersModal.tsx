import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addRoomUsers, removeRoomUser} from '../../functions/Room';
import {TTimestampClient} from '../../types/Firebase';
import SmallUserCard from '../cards/SmallUserCard';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import SelectForm from '../forms/SelectForm';

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
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<'list' | 'invite'>('list');

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
    try {
      setSubmitting(true);
      await addRoomUsers({room, users: {ids: [authUserData.id]}});
      onUpdate(undefined);
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to join room.'});
    } finally {
      setSubmitting(false);
    }
  };
  const onLeave = async () => {
    try {
      setSubmitting(true);
      await removeRoomUser({room, user: {id: authUserData.id}});
      onUpdate(undefined);
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to leave room.'});
    } finally {
      setSubmitting(false);
    }
  };

  const right = {
    icon: joined ? 'user-minus' : 'user-plus',
    onPress: joined ? onLeave : onJoin,
    submitting,
  };

  const onInvite = async (ids: string[]) => {
    try {
      setSubmitting(true);
      await addRoomUsers({room, users: {ids}});
      onUpdate(undefined);
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to join room.'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultModal style={{zIndex: 200}}>
      {form === 'list' && (
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
              <View>
                <DefaultText
                  title="Check who shared most recently!"
                  textStyle={{fontWeight: 'bold'}}
                  style={{marginBottom: 20}}
                />
                <DefaultText
                  title="Invite friends"
                  textStyle={{fontWeight: 'bold'}}
                  style={{marginBottom: 20}}
                  onPress={() => setForm('invite')}
                />
              </View>
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
      )}
      {form === 'invite' && (
        <SelectForm
          data={authUserData.followTo.items
            .map(({id, displayName}) => ({
              id,
              name: displayName,
            }))
            .some(({id: elId}) => {
              return !users.map(({id: elId}) => elId).includes(elId);
            })}
          title="Invite"
          onSuccess={onInvite}
          onCancel={() => setForm('list')}
          submitting={submitting}
        />
      )}
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
