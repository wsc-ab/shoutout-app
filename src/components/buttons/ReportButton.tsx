import React, {useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import {createReport} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  collection: string;
  id: string;
  onSuccess: () => void;
  style?: TStyleView;
};

const ReportButton = ({id, collection, onSuccess, style}: TProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onReport = () => {
    const onPress = async () => {
      try {
        setIsLoading(true);

        await createReport({target: {collection, id}});

        Alert.alert('Successfully reported');

        onSuccess();
      } catch (error) {
        if ((error as {message: string}).message === "target doesn't exist") {
          Alert.alert('This content has been deleted');
        } else {
          Alert.alert('Please retry', (error as {message: string}).message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    Alert.alert(
      'Please confirm',
      "Report this content? We'll no longer show you this content.",
      [{text: 'Report', onPress, style: 'destructive'}, {text: 'No'}],
    );
  };

  return (
    <View style={style}>
      {!isLoading && (
        <DefaultIcon icon="flag" onPress={onReport} style={styles.icon} />
      )}
      {isLoading && <ActivityIndicator style={styles.icon} />}
    </View>
  );
};

export default ReportButton;

const styles = StyleSheet.create({icon: {alignItems: 'flex-end'}});
