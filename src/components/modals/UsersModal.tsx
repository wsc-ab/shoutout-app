import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addChannelUsers, removeChannelUser} from '../../functions/Channel';
import {TDocData, TTimestampClient} from '../../types/Firebase';
import SmallUserCard from '../cards/SmallUserCard';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  channel: TDocData;
  users: {
    id: string;
    displayName: string;
    moment?: {addedAt: TTimestampClient};
  }[];
};

const UsersModal = ({channel, users}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);

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
      await addChannelUsers({
        channel: {id: channel.id},
        users: {ids: [authUserData.id]},
      });
      onUpdate(undefined);
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to join channel.'});
    } finally {
      setSubmitting(false);
    }
  };
  const onLeave = async () => {
    try {
      setSubmitting(true);
      await removeChannelUser({
        channel: {id: channel.id},
        user: {id: authUserData.id},
      });
      onUpdate(undefined);
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to leave channel.'});
    } finally {
      setSubmitting(false);
    }
  };

  const right =
    channel.createdBy.id === authUserData.id
      ? undefined
      : {
          icon: joined ? 'user-minus' : 'user-plus',
          onPress: joined ? onLeave : onJoin,
          submitting,
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
            <View>
              <DefaultText
                title="Check who shared most recently!"
                textStyle={{fontWeight: 'bold'}}
                style={{marginBottom: 20}}
              />
              <DefaultText
                title={`Channel code: ${channel.code}`}
                textStyle={{fontWeight: 'bold'}}
                style={{marginBottom: 20}}
              />
            </View>
          }
          renderItem={({item, index}) => {
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
