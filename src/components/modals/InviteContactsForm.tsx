import React, {useContext} from 'react';
import {ActivityIndicator, Linking, Platform, View} from 'react-native';
import AuthUserContext from '../../../contexts/AuthUser';
import LanguageContext from '../../../contexts/Language';

import DefaultText from '../../atoms/texts/DefaultText';
import InviteButton from '../../molecules/buttons/InviteButton';

import {defaultBlack} from '../../../assets/style/DefaultColor';
import {formStyle} from '../../../assets/style/ModalStyle';
import ContactsContext from '../../../contexts/Contacts';
import {createShareLink} from '../../../utils/DynamicLink';
import {getFriendStatus, onFriend} from '../../../utils/Friend';
import SectionHeader from '../../atoms/lists/SectionHeader';
import ActionCard from '../../molecules/cards/ActionCard';
import FormDetails from '../../molecules/modal/FormDetails';
import Header from '../../molecules/modal/FormHeader';
import {friendOptions} from './FriendsModal';

type TProps = {
  onSuccess: () => void;
  onCancel: () => void;
  details?: string[];
};

const InviteContactsForm = ({details, onSuccess, onCancel}: TProps) => {
  const {language} = useContext(LanguageContext);
  const {dynamicLinkTarget, authUser} = useContext(AuthUserContext);
  const {inviteContacts, exisitingContacts, status} =
    useContext(ContactsContext);

  const onInviteContact = async (phoneNumber: string) => {
    const inviteLink = await createShareLink({
      target: dynamicLinkTarget,
      language,
    });

    await Linking.openURL(
      `sms:${phoneNumber}${
        Platform.OS === 'ios' ? '&' : '?'
      }body=Come to Airballoon and check out my curations! ${inviteLink}`,
    );
  };

  const onPressDone = () => {
    onSuccess();
  };

  const onPress = async ({id}: {id: string}) => {
    onFriend({
      id,
      authUserId: authUser.id,
    });
  };

  return (
    <View>
      <Header
        title={localization.invite}
        left={{
          text: 'cancel',
          onPress: onCancel,
          disabled: undefined,
        }}
        right={{
          text: 'done',
          onPress: onPressDone,
          disabled: undefined,
          isSubmitting: false,
        }}
      />
      <FormDetails details={details} />
      <InviteButton style={{marginBottom: 10}} />
      {status === 'loaded' && (
        <>
          <View>
            <SectionHeader
              title={localization.friends}
              style={{marginBottom: 10}}
            />
            {exisitingContacts.map((contact, index) => {
              const followToUserIds = authUser.followTo.users?.baseIds ?? [];
              const followFromUserIds =
                authUser.followFrom.users?.baseIds ?? [];

              const enableButtonStatuses = ['none', 'followFrom'];

              const friendStatus = getFriendStatus({
                followToUserIds,
                followFromUserIds,
                id: contact.id,
              });

              const enableButton = enableButtonStatuses.includes(friendStatus);

              return (
                <ActionCard
                  key={contact.id + index}
                  title={contact.name}
                  detail={contact.phoneNumber}
                  buttonTitle={friendOptions[friendStatus].title}
                  buttonColor={defaultBlack.lv4}
                  style={{...formStyle.container, marginBottom: 10}}
                  onPress={
                    enableButton ? () => onPress({id: contact.id}) : undefined
                  }
                />
              );
            })}
            {exisitingContacts.length === 0 && (
              <DefaultText
                title={localization.noOne}
                style={{marginBottom: 20}}
              />
            )}
          </View>
          <View>
            <SectionHeader
              title={localization.inviteFriends}
              style={{marginBottom: 10}}
            />
            {inviteContacts.map((contact, index) => (
              <ActionCard
                key={contact.phoneNumber + index}
                onPress={() => onInviteContact(contact.phoneNumber)}
                title={contact.name}
                detail={contact.phoneNumber}
                buttonTitle={localization.invite}
                buttonColor={defaultBlack.lv4}
                style={{...formStyle.container, marginBottom: 10}}
              />
            ))}
          </View>
        </>
      )}
      {status === 'loading' && <ActivityIndicator />}
    </View>
  );
};

export default InviteContactsForm;

const localizations = {
  en: {
    invite: 'Invite',
    body: 'Come to Airballoon and view cool curations!',
    inviteFriends: 'Invite friends',
    noOne:
      'No one is using Airballoon yet. Invite them over and share curations!',
    friends: 'Friends on Airballoon',
  },
  ko: {
    invite: '초대하기',
    body: '에어벌룬으로 와서 멋진 큐레이션를 구경해봐!',
    inviteFriends: '친구 초대하기',
    friends: '에어벌룬에 있는 친구들',
    noOne:
      '아무도 에어벌룬을 사용하고 있지 않아요. 초대해서 좋은 정보를 공유하세요!',
  },
};
