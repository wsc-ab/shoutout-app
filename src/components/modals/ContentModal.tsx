import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {deleteContent} from '../../functions/Content';
import {TObject} from '../../types/Firebase';
import {getStartDate} from '../../utils/Date';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ContentCard from '../screen/ContentCard';

type TProps = {
  onCancel: () => void;
  content?: TObject;
};

const ContentModal = ({onCancel, content}: TProps) => {
  const [submitting, setSubmitting] = useState(false);
  const {height, width} = useWindowDimensions();

  const onDelete = () => {
    const onPress = async () => {
      if (!content) {
        return;
      }
      try {
        setSubmitting(true);
        await deleteContent({content: {id: content.id}});
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

  const startDate = getStartDate();

  return (
    <DefaultModal style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <DefaultIcon icon="angle-left" onPress={onCancel} />
        </View>
        <DefaultText title={'Content'} textStyle={styles.centerText} />
        <View style={styles.right} />
      </View>
      {content && (
        <ContentCard
          content={content}
          style={styles.content}
          contentStyle={{
            width,
            height,
          }}
        />
      )}
      <View style={styles.icons}>
        <DefaultText
          title={`Will be shown from ${
            startDate.getMonth() + 1
          }/${startDate.getDate()} ${startDate.getHours()}:00 to ${
            startDate.getMonth() + 1
          }/${startDate.getDate() + 1} ${startDate.getHours() - 1}:59`}
          style={styles.date}
        />
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
  date: {flex: 1, padding: 10},
  act: {paddingHorizontal: 10},
  icons: {
    flexDirection: 'row',
    bottom: 40,
    left: 10,
    right: 10,
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
