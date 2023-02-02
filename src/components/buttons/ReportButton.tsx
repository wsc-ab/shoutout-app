import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {createReport} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  collection: string;
  id: string;
  onSuccess?: () => void;
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

        onSuccess && onSuccess();
      } catch (error) {
        if ((error as {message: string}).message === "target doesn't exist") {
          DefaultAlert({
            title: 'Deleted moment',
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
      message: "Report this moment? We'll no longer show you this moment.",
      buttons: [{text: 'Report', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  return (
    <View style={style}>
      {!isLoading && <DefaultIcon icon="flag" onPress={onReport} />}
      {isLoading && <ActivityIndicator style={styles.act} />}
    </View>
  );
};

export default ReportButton;

const styles = StyleSheet.create({
  act: {paddingHorizontal: 10},
});
