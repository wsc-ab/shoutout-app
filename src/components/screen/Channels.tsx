import React, {useContext, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {getChannels} from '../../functions/Channel';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import CreateRoomButton from '../buttons/CreateRoomButton';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import ChannelSummary from './ChannelSummary';

type TProps = {
  style: TStyleView;
};

const Channels = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {onUpdate} = useContext(ModalContext);
  const [data, setData] = useState<TDocData[]>([]);
  const [status, setStatus] = useState<TStatus>('loading');
  const [tab, setTab] = useState<'my' | 'public'>('my');

  useEffect(() => {
    const load = async () => {
      try {
        const {channels} = await getChannels({pagination: {number: 10}});

        setData(channels);
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

  const renderItem = ({item}) => {
    return <ChannelSummary channel={{id: item.id}} />;
  };

  return (
    <View style={style}>
      <View
        style={{flexDirection: 'row', marginHorizontal: 10, marginBottom: 10}}>
        <DefaultText
          title="My"
          onPress={() => setTab('my')}
          style={{
            padding: 10,
            borderRadius: 50,
            borderColor: tab === 'my' ? defaultRed.lv2 : 'white',
            borderWidth: 1,
          }}
        />
        <DefaultText
          title="Public"
          onPress={() => setTab('public')}
          style={{
            padding: 10,
            borderRadius: 50,
            marginLeft: 10,
            borderColor: tab === 'public' ? defaultRed.lv2 : 'white',
            borderWidth: 1,
          }}
        />
        <DefaultText
          title="Code"
          onPress={() => onUpdate({target: 'channelCode'})}
          style={{
            padding: 10,
            borderRadius: 50,
            marginLeft: 10,
            borderColor: 'white',
            borderWidth: 1,
          }}
        />
      </View>
      {tab === 'my' && (
        <FlatList
          data={authUserData.inviteFrom.items}
          contentContainerStyle={styles.contentContainer}
          renderItem={renderItem}
          indicatorStyle="white"
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={() => {
                setStatus('loading');
              }}
              tintColor={'gray'}
            />
          }
        />
      )}
      {tab === 'public' && (
        <FlatList
          data={data}
          contentContainerStyle={styles.contentContainer}
          renderItem={renderItem}
          indicatorStyle="white"
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={() => {
                setStatus('loading');
              }}
              tintColor={'gray'}
            />
          }
        />
      )}
      <View style={styles.footer}>
        <CreateRoomButton style={styles.create} />
      </View>
    </View>
  );
};

export default Channels;

const styles = StyleSheet.create({
  contentContainer: {paddingBottom: 100},
  seperator: {
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  create: {
    height: 40,
    width: 50,
    padding: 10,
    marginHorizontal: 10,
  },
});
