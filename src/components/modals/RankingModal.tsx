import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

import {getRanking} from '../../functions/Content';
import {TStatus} from '../../types/Screen1';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

type TProps = {
  onCancel: () => void;
};

const RankingModal = ({onCancel}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');
  const [data, setData] = useState([]);

  const [date, setDate] = useState(new Date());
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
        <DefaultText title={'Top contents based on # of shoutouts.'} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <DefaultText
            title="<"
            onPress={() => {
              setDate(pre => {
                const copy = new Date(pre);
                copy.setDate(pre.getDate() - 1);

                return copy;
              });
            }}
          />
          <View style={{alignItems: 'center'}}>
            <DefaultText title={'Start at'} />
            <DefaultText
              title={`${date.getMonth() + 1}/${date.getDate() + 1} 09:00`}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <DefaultText title={'End at'} />
            <DefaultText
              title={`${date.getMonth() + 1}/${date.getDate() + 2} 08:59`}
            />
          </View>

          <DefaultText
            title=">"
            textStyle={{
              color: date.getDate() === now.getDate() ? 'gray' : 'white',
            }}
            onPress={
              date.getDate() === now.getDate()
                ? undefined
                : () => {
                    setDate(pre => {
                      const copy = new Date(pre);

                      copy.setDate(pre.getDate() + 1);
                      return copy;
                    });
                  }
            }
          />
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
            title="No ranking for this day"
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
