import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

import {getRank} from '../../functions/Content';
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

const RankModal = ({onCancel}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');
  const [data, setData] = useState<TObject>();

  const [userModalId, setUserModalId] = useState<string>();

  const [date, setDate] = useState(getCurrentDate());
  useEffect(() => {
    const load = async () => {
      try {
        const {rank} = await getRank({
          date: date.toUTCString(),
        });

        setData(rank);

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
  const tomorrow = new Date(date);
  tomorrow.setUTCDate(date.getUTCDate() + 1);

  return (
    <DefaultModal>
      <DefaultForm title="Rank" left={{onPress: onCancel}}>
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
            title={`${tomorrow.getMonth() + 1}/${tomorrow.getDate()} ${
              tomorrow.getHours() - 1
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
            data={
              data.contents?.items.filter(
                (item: TObject) => item.likeFrom?.users?.number >= 1,
              ) ?? []
            }
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
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <DefaultIcon
                        icon="heart"
                        style={{padding: 0, marginRight: 5}}
                      />
                      <DefaultText
                        title={(item.likeFrom?.users?.number ?? 0).toString()}
                        textStyle={{fontWeight: 'bold'}}
                      />
                    </View>
                  </View>
                  <DefaultText
                    title={`${item.contributeFrom?.users.items[0].name}`}
                    textStyle={{fontWeight: 'bold'}}
                    style={{alignSelf: 'flex-start', marginBottom: 10}}
                    onPress={() =>
                      setUserModalId(item.contributeFrom?.users.items[0].id)
                    }
                  />
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
            title="No rank found."
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

export default RankModal;
