import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import {createShareLink} from '../../utils/Share';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import openShareModal from '../modals/ShareModal';

type TProps = {
  style?: TStyleView;
};

const InviteCard = ({style}: TProps) => {
  const {bundleId} = useContext(AuthUserContext);

  const onPress = async () => {
    try {
      const target =
        bundleId === 'app.airballoon.Shoutout' ? 'development' : 'production';

      const shareLink = await createShareLink({target});
      await openShareModal({
        title: "Let's connect our live moments on Shoutout!",
        url: shareLink,
      });
    } catch (error) {
      DefaultAlert({
        title: 'Failed to open share modal',
        message: (error as {message: string}).message,
      });
    }
  };
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}>
      <DefaultText title={'Invite friends'} textStyle={styles.textName} />
      <DefaultText
        title={'Connect your live moments with more friends!'}
        style={styles.detail}
      />
    </Pressable>
  );
};

export default InviteCard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  textName: {fontWeight: 'bold'},
  detail: {marginTop: 5},
});
