import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {getPrompts} from '../../functions/Prompt';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {getSecondsGap, getTimeGap} from '../../utils/Date';
import {getThumbnailPath} from '../../utils/Storage';
import AddMomentButton from '../buttons/AddMomentButton';
import CreateButton from '../buttons/CreateButton';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  style: TStyleView;
};

const Prompts = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);
  const [status, setStatus] = useState<TStatus>('loading');

  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);

  useEffect(() => {
    const load = async () => {
      try {
        const {prompts: newPrompts} = await getPrompts({});

        setData(newPrompts);
        setStatus('loaded');
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });

        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [status]);

  if (status === 'error') {
    return (
      <View style={styles.noData}>
        <DefaultText title="Error. Please retry." />
        <DefaultText
          title="Reload"
          onPress={() => setStatus('loading')}
          style={styles.refresh}
        />
      </View>
    );
  }

  const renderItem = ({item}) => {
    const authUserItem = item.moments.items.filter(
      ({user: {id: elId}}) => elId === authUserData.id,
    );

    const addedUserIds = item.moments.items.map(({id: elId}) => elId);

    const users =
      item.invited.items?.map(item => ({
        ...item,
        added: addedUserIds.includes(item.id),
      })) ?? [];

    const added = authUserItem.length >= 1;
    const expired = getSecondsGap({end: item.endAt}) >= 0;

    const onView = ({id, path}: {id: string; path: string}) =>
      onUpdate({target: 'prompt', data: {id, path}});

    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 20,
          borderRadius: 10,
          marginHorizontal: 10,
        }}>
        {item.moments.items.map(({name, path, addedAt, user: {id: userId}}) => {
          const late = getSecondsGap({start: addedAt, end: item.endAt}) >= 0;
          return (
            <Pressable
              key={path}
              style={{flexDirection: 'row', marginBottom: 10}}
              onPress={() => {
                onView({id: item.id, path});
              }}>
              <DefaultIcon
                icon="user"
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  width: 50,
                }}
              />
              <Pressable
                style={{marginLeft: 10, flex: 1}}
                onPress={() => {
                  onUpdate({target: 'users', data: {id: userId}});
                }}>
                <DefaultText
                  title={item.createdBy.displayName}
                  textStyle={{fontWeight: 'bold'}}
                />
                <DefaultText title={name} />
                {late && (
                  <DefaultText title={`${getTimeGap(addedAt)} ago (late)`} />
                )}
                {!late && <DefaultText title={`${getTimeGap(addedAt)} ago`} />}
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
        })}

        <View
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderColor: 'gray',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              {!expired && !added && <AddMomentButton id={item.id} />}
              {!expired && added && (
                <DefaultText title={`Closing in ${getTimeGap(item.endAt)}`} />
              )}
              {expired && !added && <DefaultText title={'Missed'} />}
              {expired && added && <DefaultText title={'Shared my moment'} />}
            </View>

            <Pressable
              style={{flexDirection: 'row'}}
              onPress={() => onUpdate({target: 'promptUsers', data: {users}})}>
              <DefaultIcon icon="user-group" style={{padding: 0}} />
              <DefaultText
                title={item.invited.number}
                style={{marginLeft: 5}}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={style}>
      <FlatList
        data={data}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item, index) => {
          if (item.type === 'inviteFriend') {
            return item.type + index;
          }

          return item.id + item.content?.path;
        }}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => setStatus('loading')}
            tintColor={'gray'}
            progressViewOffset={100}
          />
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <CreateButton
        onCreate={() => setStatus('loading')}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          marginHorizontal: 20,
        }}
      />
    </View>
  );
};

export default Prompts;

const styles = StyleSheet.create({
  contentContainer: {paddingTop: 100, paddingBottom: 150},
  seperator: {
    marginVertical: 10,
    borderColor: 'gray',
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
