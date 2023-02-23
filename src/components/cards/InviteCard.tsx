import React, {useContext, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import {createShareLink} from '../../utils/Share';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import openShareModal from '../modals/ShareModal';

type TProps = {
  style?: TStyleView;
};

const InviteCard = ({style}: TProps) => {
  const {bundleId} = useContext(AuthUserContext);
  const [submitting, setSubmitting] = useState(false);

  const onPress = async () => {
    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.body}>
        <DefaultText title={'Invite friends'} textStyle={styles.textName} />
        <DefaultText
          title={'Connect live moments with more friends!'}
          numberOfLines={1}
          style={styles.detail}
          textStyle={styles.detailText}
        />
      </View>
      {!submitting && <DefaultIcon icon="plus" />}
      {submitting && <ActivityIndicator />}
    </Pressable>
  );
};

export default InviteCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  body: {flex: 1},
  textName: {fontWeight: 'bold', fontSize: 20},
  detail: {marginTop: 5},
  detailText: {fontWeight: 'bold'},
});
