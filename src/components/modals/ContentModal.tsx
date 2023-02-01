import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {deleteContent, getContent} from '../../functions/Content';
import {TDocData} from '../../types/Firebase';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

type TProps = {
  onCancel: () => void;
  id: string;
  onNext: () => void;
};

const ContentModal = ({onCancel, onNext, id}: TProps) => {
  const [submitting, setSubmitting] = useState(false);
  const {height, width} = useWindowDimensions();

  const [data, setData] = useState<TDocData>();

  useEffect(() => {
    const load = async () => {
      const {content} = await getContent({content: {id}});

      setData(content);
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
        await deleteContent({content: {id: data.id}});
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
      message: 'Delete this content? It will no longer receive shoutouts.',
      buttons: [{text: 'Delete', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  return (
    <DefaultModal style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <DefaultIcon icon="angle-left" onPress={onCancel} />
        </View>
        <DefaultText title={'Content'} textStyle={styles.centerText} />
        <View style={styles.right} />
      </View>
      {data && (
        <ContentCard
          content={data}
          style={styles.content}
          contentStyle={{
            width,
            height,
          }}
          showNav={true}
          onNext={onNext}
        />
      )}
      <View style={styles.icons}>
        {!submitting && <DefaultIcon icon="times" onPress={onDelete} />}
        {submitting && <ActivityIndicator style={styles.act} />}
      </View>
    </DefaultModal>
  );
};

export default ContentModal;

const styles = StyleSheet.create({
  container: {paddingHorizontal: 0},
  content: {position: 'absolute', top: 0, left: 0},
  act: {paddingHorizontal: 10},
  icons: {
    flexDirection: 'row',
    top: 80,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 40,
    zIndex: 100,
  },
  left: {flex: 1, alignItems: 'flex-start'},
  centerText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  right: {flex: 1, alignItems: 'flex-end'},
});
