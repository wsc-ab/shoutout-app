import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {deleteMoment, removeComment} from '../../functions/Moment';
import {TTimestamp} from '../../types/Firebase';
import {getTimeGap} from '../../utils/Date';
import SubmitIconButton from '../buttons/SubmitIconButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  moment: {id: string};
  item: {
    addedAt: TTimestamp;
    user: {id: string; displayName: string};
    detail: string;
  };
  index: number;
};

const Comment = ({moment, item, index}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  const onRemove = async ({
    detail,
    addedAt,
  }: {
    detail: string;
    addedAt: TTimestamp;
  }) => {
    try {
      await removeComment({moment, comment: {detail, addedAt}});
    } catch (error) {
      DefaultAlert({title: 'Error', message: 'Failed to remove comment'});
    }
  };

  const onDelete = () => {
    const onPress = async () => {
      try {
        await deleteMoment({moment});
      } catch (error) {
        DefaultAlert({title: 'Error', message: 'Failed to remove comment'});
      }
    };

    DefaultAlert({
      title: 'Delete moment?',
      message: "You can't restore this moment once deleted!",
      buttons: [{text: 'No'}, {text: 'Delete', onPress, style: 'destructive'}],
    });
  };

  return (
    <View style={styles.container} key={item.detail + index}>
      <UserProfileImage
        user={{
          id: item.user.id,
        }}
      />

      <View style={styles.texts}>
        <DefaultText
          title={item.user.displayName}
          textStyle={styles.displayNameText}
        />
        <DefaultText title={item.detail} />
        <DefaultText
          title={`${getTimeGap(item.addedAt)} ago`}
          textStyle={styles.addedAtText}
        />
      </View>
      {item.user.id === authUserData.id && index === 0 && (
        <SubmitIconButton icon="times" onPress={() => onDelete()} />
      )}
      {item.user.id === authUserData.id && index !== 0 && (
        <SubmitIconButton
          icon="times"
          onPress={async () => await onRemove(item)}
        />
      )}
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  texts: {flex: 1, marginLeft: 10},
  displayNameText: {fontWeight: 'bold', fontSize: 18},
  addedAtText: {fontSize: 14, color: 'lightgray'},
});
