import React from 'react';
import {Alert, View} from 'react-native';
import DefaultText from '../defaults/DefaultText';
import {createReport} from '../functions/Content';
import {TStyleView} from '../types/style';

type TProps = {
  collection: string;
  id: string;
  onSuccess: () => void;
  style?: TStyleView;
};

const ReportButton = ({id, collection, onSuccess, style}: TProps) => {
  const onReport = () => {
    const onPress = async () => {
      try {
        await createReport({target: {collection, id}});
        Alert.alert('Successfully reported');
        onSuccess();
      } catch (error) {
        Alert.alert('Please retry', 'Failed to report');
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
      <DefaultText title="Report" onPress={onReport} />
    </View>
  );
};

export default ReportButton;
