import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Linking, View} from 'react-native';

import {getRanking} from '../../functions/Content';
import {TObject} from '../../types/Firebase';
import {TStatus} from '../../types/Screen';
import {getCurrentDate} from '../../utils/Date';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

type TProps = {
  onCancel: () => void;
};

const RankingModal = ({onCancel}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');
  const [data, setData] = useState<TObject>();

  const [date, setDate] = useState(getCurrentDate());
  useEffect(() => {
    const load = async () => {
      try {
        const {ranking} = await getRanking({
          date: date.toUTCString(),
        });
        setData(ranking);

        setStatus('loaded');
      } catch (error) {
        setStatus('error');
      }
    };

    if (status === 'loading') {
      load();
    }
  }, [date, status]);

  useEffect(() => {
    setStatus('loading');
  }, [date]);

  const now = new Date();

  return (
    <DefaultModal>
      <DefaultForm
        title="Ranking"
        left={{onPress: onCancel}}
        style={{flex: 1, paddingBottom: 50}}>
        <DefaultText
          title={'Based only on # of shoutouts, not # of followers.'}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <DefaultIcon
            icon="arrow-left"
            onPress={() => {
              setDate(pre => {
                const copy = new Date(pre);
                copy.setDate(pre.getDate() - 1);

                return copy;
              });
            }}
          />

          <DefaultText
            title={`${
              date.getMonth() + 1
            }/${date.getDate()} ${date.getHours()}:00`}
          />

          <DefaultText title={'~'} />

          <DefaultText
            title={`${date.getMonth() + 1}/${date.getDate() + 1} ${
              date.getHours() - 1
            }:59`}
          />

          {date.getDate() === now.getDate() && (
            <DefaultText title="Live" textStyle={{color: defaultRed}} />
          )}
          {date.getDate() !== now.getDate() && (
            <DefaultIcon
              icon="arrow-right"
              onPress={() => {
                setDate(pre => {
                  const copy = new Date(pre);

                  copy.setDate(pre.getDate() + 1);
                  return copy;
                });
              }}
            />
          )}
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            marginVertical: 10,
          }}
        />
        {status === 'loading' && (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
        {status === 'loaded' && data && (
          <FlatList
            data={data.contents?.items ?? []}
            renderItem={({item, index}) => (
              <View key={item.id}>
                <DefaultText
                  title={`#${index + 1} with ${
                    item.shoutoutFrom?.users?.number
                  } shoutouts`}
                />
                <DefaultText
                  title={`by ${item.contributeFrom?.users.items[0].name}`}
                  style={{marginBottom: 10}}
                  onPress={
                    item.contributeFrom?.users.items[0].link
                      ? () =>
                          Linking.openURL(
                            item.contributeFrom?.users.items[0].link,
                          )
                      : undefined
                  }
                />
                <ContentCard content={item} />
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  marginVertical: 10,
                }}
              />
            )}
          />
        )}
        {status === 'loaded' && !data && (
          <DefaultText
            title="No ranking found."
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      </DefaultForm>
    </DefaultModal>
  );
};

export default RankingModal;
