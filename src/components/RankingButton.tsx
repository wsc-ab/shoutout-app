import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../types/style';
import DefaultIcon from './DefaultIcon';
import RankingModal from './RankingModal';

type TProps = {style: TStyleView};

const RankingButton = ({style}: TProps) => {
  const [modal, setModal] = useState<'ranking'>();

  return (
    <View style={style}>
      <DefaultIcon
        icon="list"
        onPress={() => setModal('ranking')}
        style={styles.icon}
      />
      {modal === 'ranking' && (
        <RankingModal onCancel={() => setModal(undefined)} />
      )}
    </View>
  );
};

export default RankingButton;

const styles = StyleSheet.create({icon: {alignItems: 'center'}});
