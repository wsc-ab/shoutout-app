import React, {useContext, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addChannelUsers, removeChannelUser} from '../../functions/Channel';
import {TDocData} from '../../types/Firebase';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {channel: TDocData};

const ChannelSearch = ({channel}: TProps) => {
  const [submitting, setSubmitting] = useState(false);
  const {authUserData} = useContext(AuthUserContext);

  const joined = authUserData.inviteFrom.items.some(
    ({id: elId}) => elId === channel.objectID,
  );

  const onJoin = async () => {
    try {
      setSubmitting(true);
      await addChannelUsers({
        channel: {id: channel.objectID},
        users: {ids: [authUserData.id]},
      });
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
        channel: {id: channel.objectID},
        user: {id: authUserData.id},
      });
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to leave channel.'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginBottom: 20,
      }}>
      <DefaultText
        title={channel.name}
        textStyle={{fontWeight: 'bold', fontSize: 20}}
        style={{flex: 1}}
      />

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginRight: 10,
        }}>
        <DefaultIcon
          icon="user-group"
          style={{padding: 0}}
          size={20}
          color={'white'}
        />
        <DefaultText title={channel.inviteTo.number} style={{marginLeft: 5}} />
      </View>
      {!joined && !submitting && (
        <DefaultIcon icon="user-plus" size={20} onPress={onJoin} />
      )}
      {joined && !submitting && (
        <DefaultIcon icon="user-minus" size={20} onPress={onLeave} />
      )}
      {submitting && <ActivityIndicator />}
    </View>
  );
};

export default ChannelSearch;
