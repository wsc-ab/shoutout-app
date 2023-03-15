import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  user: {id: string};
  onCancel: () => void;
};

const UserModal = ({user, onCancel}: TProps) => {
  const [data, setData] = useState<TDocData>();
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const userData = (
          await firestore().collection('users').doc(user.id).get()
        ).data();
        setData(userData);
        setStatus('loaded');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [status, user.id]);

  if (!data) {
    return null;
  }

  return (
    <DefaultModal>
      <DefaultForm title={'User'} left={{onPress: onCancel}}>
        <View style={styles.user}>
          <UserProfileImage
            user={{
              id: data.id,
            }}
          />
          <DefaultText
            title={data.displayName}
            style={styles.displayName}
            textStyle={styles.displayNameText}
          />
        </View>
        <DefaultText
          title={`Joined ${data.inviteFrom.number} channels.`}
          style={styles.channels}
        />
        <DefaultText
          title={`Shared ${data.contributeTo.number} moments.`}
          style={styles.moments}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  user: {flexDirection: 'row'},
  displayName: {marginLeft: 10},
  displayNameText: {fontWeight: 'bold', fontSize: 20},
  channels: {marginTop: 10},
  moments: {marginTop: 10},
});
