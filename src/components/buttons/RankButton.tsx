import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import RankModal from '../modals/RankModal';

type TProps = {style: TStyleView; onModal: (visible: boolean) => void};

const RankButton = ({style, onModal}: TProps) => {
  const [modal, setModal] = useState<'rank'>();

  const onPress = () => {
    onModal(true);
    setModal('rank');
  };

  return (
    <View style={style}>
      <DefaultIcon icon="ranking-star" onPress={onPress} style={styles.icon} />
      {modal === 'rank' && (
        <RankModal
          onCancel={() => {
            onModal(false);
            setModal(undefined);
          }}
        />
      )}
    </View>
  );
};

export default RankButton;

const styles = StyleSheet.create({icon: {alignItems: 'center'}});
