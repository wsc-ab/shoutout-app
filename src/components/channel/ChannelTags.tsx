import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {checkGhosting, checkSpam} from '../../utils/Channel';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import {localizations} from './Channel.localizations';

type TProps = {
  channel: TDocData;
  style?: TStyleView;
};

const ChannelTags = ({channel, style}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const {authUserData} = useContext(AuthUserContext);

  const ghosting = checkGhosting({authUser: authUserData, channel});
  const {spam} = checkSpam({authUser: authUserData, channel});
  return (
    <View style={[styles.container, style]}>
      <DefaultText
        title={
          channel.options.type === 'private'
            ? localization.private
            : localization.public
        }
        style={styles.tag}
      />
      {channel.options.mode === 'camera' && (
        <DefaultText title={localization.camera} style={styles.tag} />
      )}
      {channel.options.mode === 'library' && (
        <DefaultText title={localization.library} style={styles.tag} />
      )}
      {channel.options.anonymous === 'on' && (
        <DefaultText title={localization.anonymous} style={styles.tag} />
      )}

      {['1', '7', '14'].includes(channel.options.ghosting?.mode) && (
        <DefaultText
          title={`${localization.ghosting} ${channel.options.ghosting.mode}`}
          style={[styles.tag, ghosting && styles.active]}
          textStyle={ghosting && styles.activeText}
        />
      )}
      {channel.options.spam && channel.options.spam !== 'off' && (
        <DefaultText
          title={`${localization.spam} ${channel.options.spam}`}
          style={[styles.tag, spam && styles.active]}
          textStyle={spam && styles.activeText}
        />
      )}
    </View>
  );
};

export default ChannelTags;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  tag: {
    backgroundColor: 'gray',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 5,
  },
  active: {backgroundColor: defaultRed.lv2},
  activeText: {color: 'black'},
});
