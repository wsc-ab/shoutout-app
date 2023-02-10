import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {THitItem} from '../../types/Algolia';
import {getSameIds} from '../../utils/Array';
import {createShareLink} from '../../utils/Share';
import ActionCard from '../cards/ActionCard';
import UserCard from '../cards/UserCard';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import SearchForm from './SearchForm';
import openShareModal from './ShareModal';

type TProps = {};

const FriendsModal = ({}: TProps) => {
  const {authUserData, bundleId} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);

  const friends = getSameIds(
    authUserData.followFrom.items,
    authUserData.followTo.items,
  );

  const [tab, setTab] = useState<'friends' | 'search'>('friends');

  const onInvite = async () => {
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

  const renderItem = (item: THitItem) => {
    if (item.objectID === authUserData.id) {
      return null;
    }

    return <UserCard key={item.objectID} {...item} id={item.objectID} />;
  };

  return (
    <DefaultModal>
      <DefaultForm
        title="Friends"
        left={{onPress: () => onUpdate(undefined)}}
        right={{
          icon: tab === 'friends' ? 'search' : 'times',
          onPress: () => setTab(tab === 'friends' ? 'search' : 'friends'),
        }}>
        {tab === 'friends' && (
          <View>
            <ActionCard
              name={'Invite friends'}
              detail={'Connect your live moments with more friends!'}
              style={{marginBottom: 10, backgroundColor: defaultBlack.lv3(1)}}
              onPress={onInvite}
            />
            <DefaultText
              title="Friends"
              style={{marginBottom: 5}}
              textStyle={styles.textHeader}
            />
            {friends.map(item => (
              <UserCard {...item} key={item.id} />
            ))}

            <DefaultText
              title="Followers"
              style={{marginTop: 10, marginBottom: 5}}
              textStyle={styles.textHeader}
            />
            {authUserData.followFrom.items.map(item => (
              <UserCard {...item} key={item.id} />
            ))}
            <DefaultText
              title="Followings"
              style={{marginTop: 10, marginBottom: 5}}
              textStyle={styles.textHeader}
            />
            {authUserData.followTo.items.map(item => (
              <UserCard {...item} key={item.id} />
            ))}
          </View>
        )}
        {tab === 'search' && (
          <SearchForm indexes={[{name: 'users'}]} renderItem={renderItem} />
        )}
      </DefaultForm>
    </DefaultModal>
  );
};

export default FriendsModal;

const styles = StyleSheet.create({
  textHeader: {fontWeight: 'bold', fontSize: 20},
});

export const friendOptions = {
  followTo: {title: 'Following'},
  followFrom: {title: 'Accept'},
  followToFrom: {title: 'Friends'},
  none: {title: ' Follow'},
};
