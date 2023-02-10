import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {getSameIds} from '../../utils/Array';
import ActionCard from '../cards/ActionCard';
import UserCard from '../cards/UserCard';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import SearchForm from './SearchForm';

type TProps = {};

const FriendsModal = ({}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);

  const friends = getSameIds(
    authUserData.followFrom.items,
    authUserData.followTo.items,
  );

  const [tab, setTab] = useState<'friends' | 'search'>('friends');

  return (
    <DefaultModal>
      <DefaultForm
        title="Friends"
        left={{onPress: () => onUpdate(undefined)}}
        right={{icon: 'search', onPress: () => setTab('search')}}>
        {tab === 'friends' && (
          <View>
            <ActionCard
              name={'Invite friends'}
              detail={'Connect your live moments with friends!'}
              style={{marginBottom: 10, backgroundColor: defaultBlack.lv3(1)}}
              onPress={onInvite}
            />
            <DefaultText
              title="Friends"
              style={{marginBottom: 5}}
              textStyle={{fontWeight: 'bold'}}
            />
            {friends.map(item => (
              <UserCard {...item} key={item.id} />
            ))}

            <DefaultText
              title="Followers"
              style={{marginTop: 10, marginBottom: 5}}
              textStyle={{fontWeight: 'bold'}}
            />
            {authUserData.followFrom.items.map(item => (
              <UserCard {...item} key={item.id} />
            ))}
            <DefaultText
              title="Followings"
              style={{marginTop: 10, marginBottom: 5}}
              textStyle={{fontWeight: 'bold'}}
            />
            {authUserData.followTo.items.map((item, index) => (
              <UserCard {...item} key={item.id} />
            ))}
          </View>
        )}
        {tab === 'search' && <SearchForm />}
      </DefaultForm>
    </DefaultModal>
  );
};

export default FriendsModal;

export const friendOptions = {
  followTo: {title: 'Following'},
  followFrom: {title: 'Accept'},
  followToFrom: {title: 'Friends'},
  none: {title: ' Follow'},
};
