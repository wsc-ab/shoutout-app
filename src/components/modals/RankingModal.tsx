import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

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
import UserModal from './UserModal';

type TProps = {
  onCancel: () => void;
};

const RankingModal = ({onCancel}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');
  const [data, setData] = useState<TObject>();

  const [userModalId, setUserModalId] = useState<string>();

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
      <DefaultForm title="Ranking" left={{onPress: onCancel}}>
        <DefaultText title={'Based only on number of shoutouts received.'} />
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
            <DefaultText
              title="Live"
              textStyle={{color: defaultRed.lv1, fontWeight: 'bold'}}
            />
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
            marginVertical: 20,
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
            contentContainerStyle={{paddingBottom: 50}}
            renderItem={({item, index}) => {
              return (
                <View key={item.id} style={{alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flex: 1,
                      marginBottom: 10,
                    }}>
                    <DefaultText
                      title={`#${index + 1}`}
                      textStyle={{
                        fontWeight: 'bold',
                      }}
                      style={{flex: 1}}
                    />
                    <DefaultText
                      title={`${item.shoutoutFrom?.users?.number} shoutouts`}
                      textStyle={{fontWeight: 'bold'}}
                      style={{flex: 1, alignItems: 'center'}}
                    />
                    <DefaultText
                      title={`${item.contributeFrom?.users.items[0].name}`}
                      textStyle={{fontWeight: 'bold'}}
                      style={{flex: 1, alignItems: 'flex-end'}}
                      onPress={() =>
                        setUserModalId(item.contributeFrom?.users.items[0].id)
                      }
                    />
                  </View>
                  <ContentCard content={item} initPaused={true} showType />
                </View>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  marginVertical: 20,
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
      {userModalId && (
        <UserModal
          id={userModalId}
          onCancel={() => setUserModalId(undefined)}
        />
      )}
    </DefaultModal>
  );
};

export default RankingModal;
