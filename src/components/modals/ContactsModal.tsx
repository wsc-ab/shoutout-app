import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {THitItem} from '../../types/Algolia';
import {getSameIds} from '../../utils/Array';
import InviteCard from '../cards/InviteCard';

import UserCard from '../cards/UserCard';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import SearchForm from './SearchForm';

type TProps = {};

const ContactsModal = ({}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);

  const friends = getSameIds(
    authUserData.followFrom.items,
    authUserData.followTo.items,
  );

  const [tab, setTab] = useState<'friends' | 'search'>('friends');

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
          <ScrollView style={{flex: 1}}>
            <InviteCard
              style={{marginBottom: 10, backgroundColor: defaultBlack.lv3(1)}}
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
          </ScrollView>
        )}
        {tab === 'search' && (
          <SearchForm indexes={[{name: 'users'}]} renderItem={renderItem} />
        )}
      </DefaultForm>
    </DefaultModal>
  );
};

export default ContactsModal;

const styles = StyleSheet.create({
  textHeader: {fontWeight: 'bold', fontSize: 20},
});

export const friendOptions = {
  followTo: {title: 'Following'},
  followFrom: {title: 'Accept'},
  followToFrom: {title: 'Friends'},
  none: {title: ' Follow'},
};
