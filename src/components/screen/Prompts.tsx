import notifee from '@notifee/react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  AppState,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import UploadingContext from '../../contexts/Uploading';
import {getPrompts} from '../../functions/Prompt';
import {TDocData} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {TStyleView} from '../../types/Style';
import CreateButton from '../buttons/CreateButton';
import InviteCard from '../cards/InviteCard';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import PromptSummary from './PromptSummary';

type TProps = {
  style: TStyleView;
};

const Prompts = ({style}: TProps) => {
  const [data, setData] = useState<TDocData[]>([]);
  const [status, setStatus] = useState<TStatus>('loading');

  const {promptUpdated} = useContext(UploadingContext);

  useEffect(() => {
    if (promptUpdated) {
      setData([]);
      setStatus('loading');
    }
  }, [promptUpdated]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        setStatus('loading');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const {prompts: newPrompts} = await getPrompts({});

        setData(newPrompts);
        setStatus('loaded');
        await notifee.setBadgeCount(0);
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
    return <PromptSummary prompt={item} style={undefined} />;
  };

  const ListEmptyComponent = () => {
    return (
      <View>
        <InviteCard
          style={{backgroundColor: defaultBlack.lv2(1), marginHorizontal: 10}}
        />
        <DefaultText
          title="You need friends to start connecting!"
          style={{margin: 10}}
        />
      </View>
    );
  };

  return (
    <View style={style}>
      <FlatList
        data={data}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => setStatus('loading')}
            tintColor={'gray'}
            progressViewOffset={100}
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
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
    marginVertical: 20,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  refresh: {marginTop: 10},
});
