import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {deleteMoment, getMoment} from '../../functions/Moment';
import {TDocData} from '../../types/Firebase';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import MomentSummaryCard from '../screen/MomentSummaryCard';

type TProps = {
  onCancel: () => void;
  id: string;
};

const MomentModal = ({onCancel, id}: TProps) => {
  const [submitting, setSubmitting] = useState(false);
  const {authUserData} = useContext(AuthUserContext);

  const isContributedByUser = authUserData.contributeTo.ids.includes(id);

  const [data, setData] = useState<TDocData>();

  useEffect(() => {
    const load = async () => {
      const {moment} = await getMoment({moment: {id}});

      setData(moment);
    };

    load();
  }, [id]);

  const onDelete = () => {
    const onPress = async () => {
      if (!data) {
        return;
      }
      try {
        setSubmitting(true);
        await deleteMoment({moment: {id: data.id}});
        setSubmitting(false);
        onCancel();
      } catch (error) {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
    };

    DefaultAlert({
      title: 'Please confirm',
      message: 'Delete this moment? It will no longer receive shoutouts.',
      buttons: [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  return (
    <DefaultModal style={styles.container}>
      {data && (
        <View style={styles.header}>
          <View style={styles.left}>
            <DefaultIcon icon="angle-left" onPress={onCancel} />
          </View>
          {isContributedByUser && (
            <View style={styles.right}>
              {!submitting && <DefaultIcon icon="times" onPress={onDelete} />}
              {submitting && <ActivityIndicator style={styles.act} />}
            </View>
          )}
        </View>
      )}
      {data && (
        <MomentSummaryCard moment={data} style={styles.moment} inView={true} />
      )}
    </DefaultModal>
  );
};

export default MomentModal;

const styles = StyleSheet.create({
  container: {flex: 1},
  moment: {position: 'absolute', top: 0, left: 0},
  act: {paddingHorizontal: 10},

  header: {
    flexDirection: 'row',
    justifymoment: 'space-between',
    alignItems: 'center',
    top: 40,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  left: {flex: 1, alignItems: 'flex-start'},
  right: {flex: 1, alignItems: 'flex-end'},
});
