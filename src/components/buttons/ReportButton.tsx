import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {createReport} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
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

        DefaultAlert({
          title: 'Reported',
        });

        onSuccess();
      } catch (error) {
        if ((error as {message: string}).message === "target doesn't exist") {
          DefaultAlert({
            title: 'Deleted content',
          });
        } else {
          DefaultAlert({
            title: 'Error',
            message: (error as {message: string}).message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    DefaultAlert({
      title: 'Please confirm',
      message: "Report this content? We'll no longer show you this content.",
      buttons: [{text: 'Report', onPress, style: 'destructive'}, {text: 'No'}],
    });
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
