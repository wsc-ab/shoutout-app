import React, {useContext, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {checkSpam} from '../../utils/Channel';

import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

import CreateMomentButton from '../moment/CreateMomentButton';
import {localizations} from './Channel.localizations';
import ChannelDetailModal from './ChannelDetailModal';
import ChannelUsersModal from './ChannelUsersModal';

type TProps = {
  channel: TDocData;
  style?: TStyleView;
};

const ChannelHeader = ({channel, style}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];

  const {authUserData} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'info' | 'users'>();

  const {spam, nextTime} = checkSpam({authUser: authUserData, channel});

  const onSpam = () => {
    DefaultAlert(localization.spamAlert(nextTime));
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.name}>
        <DefaultText title={channel.name} textStyle={styles.nameText} />
        <DefaultIcon
          icon="info-circle"
          onPress={() => setModal('info')}
          style={styles.button}
        />
      </View>
      <View style={styles.button}>
        {!spam && (
          <CreateMomentButton
            channel={{id: channel.id, options: channel.options}}
          />
        )}
        {spam && <DefaultIcon icon="square-plus" size={20} onPress={onSpam} />}
        <DefaultText
          title={channel.moments.number.toString()}
          style={styles.iconNumber}
        />
      </View>
      <Pressable style={styles.button} onPress={() => setModal('users')}>
        <DefaultIcon icon="user-group" size={20} color={'white'} />
        <DefaultText
          title={channel.inviteTo.number}
          style={styles.iconNumber}
        />
      </Pressable>
      {modal === 'info' && (
        <ChannelDetailModal
          channel={channel}
          onCancel={() => setModal(undefined)}
          onSuccess={() => setModal(undefined)}
        />
      )}

      {modal === 'users' && (
        <ChannelUsersModal
          channel={channel}
          onCancel={() => setModal(undefined)}
        />
      )}
    </View>
  );
};

export default ChannelHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  name: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  nameText: {fontWeight: 'bold', fontSize: 20},
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  iconNumber: {marginLeft: 5},
});
