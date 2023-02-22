import React, {useContext, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {getPrompts} from '../../functions/Prompt';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {getTimeTill} from '../../utils/Date';
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
    const added = item.moments.items.some(
      ({user: {id: elId}}) => elId === authUserData.id,
    );

    const onView = ({id, path}: {id: string; path: string}) =>
      onUpdate({target: 'prompt', data: {id, path}});

    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 20,
          borderRadius: 10,
        }}>
        {item.moments.items.map(({name, path}) => {
          return (
            <View style={{flexDirection: 'row', marginBottom: 10}}>
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
              <View style={{marginLeft: 10, flex: 1}}>
                <DefaultText
                  title={item.createdBy.displayName}
                  textStyle={{fontWeight: 'bold'}}
                />
                <DefaultText title={name} />
              </View>
              <DefaultImage
                image={getThumbnailPath(path, 'video')}
                imageStyle={{
                  height: 50,
                  width: 50,
                }}
              />
            </View>
          );
        })}
        {!added && (
          <DefaultText
            title={`Submit yours in ${getTimeTill(item.endAt)}`}
            style={{marginTop: 10}}
          />
        )}

        {added && (
          <DefaultText
            title={'View moments'}
            style={{marginTop: 10}}
            onPress={() =>
              onView({id: item.id, path: item.moments.items[0].path})
            }
          />
        )}
        {!added && <AddMomentButton style={{marginTop: 10}} id={item.id} />}
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
        style={{position: 'absolute', bottom: 24, left: 0, right: 0}}
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
