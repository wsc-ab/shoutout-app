import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import {getRanking} from '../functions/Content';
import {TStatus} from '../types/screen';
import ContentCard from './ContentCard';

type TProps = {
  onCancel: () => void;
};

const RankingModal = ({onCancel}: TProps) => {
  const [status, setStatus] = useState<TStatus>('loading');
  const [ranking, setRanking] = useState();

  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const load = async () => {
      try {
        const {ranking: loadedRanking} = await getRanking({
          date: date.toUTCString(),
        });
        setRanking(loadedRanking);

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
      <DefaultForm title="Ranking" left={{title: 'Back', onPress: onCancel}}>
        <DefaultText
          title={'Checkout the ranking contents based on # of shoutouts.'}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
            alignItems: 'center',
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
        {status === 'loading' && (
          <ActivityIndicator
            style={{
              flex: 1,
            }}
          />
        )}
        {status === 'loaded' && ranking && (
          <View
            style={{
              flex: 1,
            }}>
            <View style={{flex: 1}}>
              {ranking.contents.items.map(content => {
                return (
                  <ContentCard
                    content={content}
                    key={content.id}
                    style={{flex: 1}}
                  />
                );
              })}
            </View>
          </View>
        )}
        {status === 'loaded' && !ranking && (
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
