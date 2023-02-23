import React, {useContext} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import UploadingContext from '../../contexts/Uploading';
import {TDocData} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {groupByLength} from '../../utils/Array';
import {getSecondsGap, getTimeGap} from '../../utils/Date';
import {getThumbnailPath} from '../../utils/Storage';
import AddMomentButton from '../buttons/AddMomentButton';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../defaults/UserProfileImage';

type TProps = {
  prompt: TDocData;
  style?: TStyleView;
};

const PromptSummary = ({prompt}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {width} = useWindowDimensions();

  const {authUserData} = useContext(AuthUserContext);

  const authUserItem = prompt.moments.items.filter(
    ({user: {id: elId}}) => elId === authUserData.id,
  );

  const users =
    prompt.inviteTo?.items?.map(elItem => ({
      ...elItem,
      moment: prompt.moments.items.filter(
        ({user: {id: elId}}) => elId === elItem.id,
      )[0],
    })) ?? [];

  const added = authUserItem.length >= 1;
  const expired = getSecondsGap({end: prompt.endAt}) >= 0;

  const onView = ({id, path}: {id: string; path: string}) =>
    onUpdate({target: 'prompts', data: {id, path}});

  const grouped = groupByLength(prompt.moments.items, 3);

  const itemWidth = width - 30;

  return (
    <View style={styles.container}>
      <DefaultText
        title={prompt.name ?? prompt.createdBy.displayName}
        style={{marginHorizontal: 10, marginBottom: 10}}
        textStyle={{fontWeight: 'bold'}}
      />
      <FlatList
        data={grouped}
        horizontal
        snapToInterval={itemWidth + 20}
        snapToAlignment={'start'}
        decelerationRate="fast"
        disableIntervalMomentum
        renderItem={({item}) => {
          return (
            <View
              style={{
                marginHorizontal: 10,
              }}>
              {item.map(
                ({name, path, addedAt, user: {id: userId, displayName}}) => {
                  const late =
                    getSecondsGap({start: addedAt, end: prompt.endAt}) >= 0;
                  return (
                    <Pressable
                      key={path}
                      style={{
                        flexDirection: 'row',
                        width: itemWidth,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        onView({id: prompt.id, path});
                      }}>
                      <UserProfileImage user={{id: userId}} />
                      <Pressable
                        style={{marginLeft: 10, flex: 1}}
                        onPress={() => {
                          onUpdate({target: 'users', data: {id: userId}});
                        }}>
                        <DefaultText
                          title={displayName}
                          textStyle={{fontWeight: 'bold'}}
                        />
                        <DefaultText title={name} />
                        {late && <DefaultText title={'Late!'} />}
                        {!late && (
                          <DefaultText title={`${getTimeGap(addedAt)} ago`} />
                        )}
                      </Pressable>
                      <DefaultImage
                        image={getThumbnailPath(path, 'video')}
                        imageStyle={{
                          height: 50,
                          width: 50,
                        }}
                      />
                    </Pressable>
                  );
                },
              )}
            </View>
          );
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          {!added && (
            <AddMomentButton id={prompt.id} style={{paddingRight: 10}} />
          )}
          {added && (
            <DefaultIcon icon="check" style={{paddingRight: 10}} size={20} />
          )}
          {!expired && (
            <DefaultText title={`Ends in ${getTimeGap(prompt.endAt)}`} />
          )}
          {expired && (
            <DefaultText
              title={`Late by ${getTimeGap(prompt.endAt)}!`}
              textStyle={{color: defaultRed.lv2}}
            />
          )}
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          onPress={() => onUpdate({target: 'promptUsers', data: {users}})}>
          <DefaultIcon icon="user-group" style={{padding: 0}} />
          <DefaultText title={prompt.invited.number} style={{marginLeft: 5}} />
        </Pressable>
      </View>
    </View>
  );
};

export default PromptSummary;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
});
