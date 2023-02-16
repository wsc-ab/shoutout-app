import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {getFriendMoments} from '../../functions/Moment';
import {TLocation, TTimestamp} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import CreateButton from '../buttons/CreateButton';
import InviteCard from '../cards/InviteCard';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import ContentCard from './ContentCard';

type TProps = {
  style: TStyleView;
};

const FriendMoments = ({style}: TProps) => {
  const [data, setData] = useState<
    {
      id: string;
      content: {
        path: string;
        location?: TLocation;
        id: string;
        addedAt: TTimestamp;
        user: {id: string};
      };
      displayName: string;
      thumbnail?: string;
      addedAt: TTimestamp;
    }[]
  >([]);
  const [status, setStatus] = useState<TStatus>('loading');
  const {onUpdate} = useContext(ModalContext);

  const {width} = useWindowDimensions();
  const videoWidth = (width - 10) / 3;
  const videoHeight = (videoWidth * 4) / 3;

  useEffect(() => {
    const load = async () => {
      try {
        const {contents} = await getFriendMoments({});

        setData(contents);
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

  const ListEmptyComponent = (
    <>
      {status === 'loaded' ? (
        <DefaultText title="No moment found. Add more friends!" />
      ) : null}
    </>
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        ListHeaderComponent={<InviteCard style={styles.invite} />}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={item => item.id + item.content.path}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => setStatus('loading')}
            tintColor={'gray'}
            progressViewOffset={100}
          />
        }
        renderItem={({item}) => {
          return (
            <ContentCard
              showUser
              content={{
                ...item.content,
                user: {
                  id: item.id,
                  displayName: item.displayName,
                  thumbnail: item.thumbnail,
                },
              }}
              onPress={() => {
                onUpdate({target: 'moments', id: item.content.id});
              }}
              contentStyle={{
                width: videoWidth,
                height: videoHeight,
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <View style={styles.buttons}>
        <CreateButton style={styles.button} />
      </View>
    </View>
  );
};

export default FriendMoments;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  contentContainer: {paddingTop: 100, paddingBottom: 150},
  seperator: {
    marginBottom: 20,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
  invite: {marginBottom: 10, backgroundColor: defaultBlack.lv2(1)},
  buttons: {
    bottom: 40,
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 100,
    left: 0,
  },
  button: {
    width: 70,
    marginRight: 10,
    backgroundColor: defaultBlack.lv2(1),
    borderRadius: 10,
  },
});
