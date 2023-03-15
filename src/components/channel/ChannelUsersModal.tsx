import {IconProp} from '@fortawesome/fontawesome-svg-core';
import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addChannelUsers, removeChannelUser} from '../../functions/Channel';
import {TDocData, TTimestamp} from '../../types/Firebase';
import SmallUserCard from '../cards/ChannelUserCard';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  channel: TDocData;
  onCancel: () => void;
};

const ChannelUsersModal = ({channel, onCancel}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);

  const users = channel.inviteTo?.items as {
    id: string;
    displayName: string;
    addedAt: TTimestamp;
  }[];

  const joined = users.some(({id}) => id === authUserData.id);

  const onJoin = async () => {
    try {
      setSubmitting(true);
      await addChannelUsers({
        channel: {id: channel.id},
        users: {ids: [authUserData.id]},
      });
      onCancel();
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
      onCancel();
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
          icon: (joined ? 'user-minus' : 'user-plus') as IconProp,
          onPress: joined ? onLeave : onJoin,
          submitting,
        };

  return (
    <DefaultModal style={{zIndex: 200}}>
      <DefaultForm
        title={'Users'}
        left={{
          onPress: onCancel,
        }}
        right={right}>
        <FlatList
          data={users}
          contentContainerStyle={styles.container}
          keyExtractor={item => item.id}
          indicatorStyle="white"
          showsVerticalScrollIndicator
          ListHeaderComponent={
            <View>
              <DefaultText
                title={`Channel code: ${channel.code}`}
                textStyle={{fontWeight: 'bold'}}
                style={{marginBottom: 20}}
              />
            </View>
          }
          renderItem={({item}) => <SmallUserCard {...item} />}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default ChannelUsersModal;

const styles = StyleSheet.create({
  container: {paddingBottom: 100, paddingHorizontal: 10},
  seperator: {
    marginBottom: 20,
  },
});
