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
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import {addItemEveryIndex} from '../../utils/Array';
import InviteCard from '../cards/InviteCard';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import ContentCard from './ContentCard';
import Footer from './Footer';

type TProps = {
  style: TStyleView;
};

const FriendMoments = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);
  const [status, setStatus] = useState<TStatus>('loading');
  const {onUpdate} = useContext(ModalContext);

  const {width} = useWindowDimensions();
  const videoWidth = (width - 10) / 3;
  const videoHeight = (videoWidth * 4) / 3;

  useEffect(() => {
    const load = async () => {
      try {
        const {contents} = await getFriendMoments({});
        console.log(contents, 'contents');

        const addNoti = [
          {type: 'inviteFriend'},
          ...addItemEveryIndex({
            array: contents,
            index: 10,
            item: {type: 'inviteFriend'},
          }),
        ];

        setData(addNoti);
        setStatus('loaded');
      } catch (error) {
        console.log(error, 'error');

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

  return (
    <View style={[styles.container, style]}>
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
        renderItem={({item}) => {
          if (item.type === 'inviteFriend') {
            return <InviteCard style={styles.invite} />;
          }

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
      <Footer />
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
  invite: {backgroundColor: defaultBlack.lv2(1)},
});
