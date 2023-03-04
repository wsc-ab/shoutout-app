import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {getRooms} from '../../functions/Room';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import CreateRoomButton from '../buttons/CreateRoomButton';
import DefaultAlert from '../defaults/DefaultAlert';
import RoomSummary from './RoomSummary';

type TProps = {
  style: TStyleView;
};

const Rooms = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);
  const [status, setStatus] = useState<TStatus>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const {rooms} = await getRooms({pagination: {number: 10}});
        setData(rooms);
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
    return <RoomSummary room={{id: item.id}} />;
  };

  return (
    <View style={style}>
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
      <View style={styles.footer}>
        <CreateRoomButton
          style={styles.create}
          onSuccess={() => {
            setStatus('loading');
          }}
        />
      </View>
    </View>
  );
};

export default Rooms;

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
