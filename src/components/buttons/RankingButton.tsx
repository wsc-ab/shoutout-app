import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import DefaultIcon from '../defaults/DefaultIcon';
import RankingModal from '../modals/RankingModal';

type TProps = {style: TStyleView; onModal: (visible: boolean) => void};

const RankingButton = ({style, onModal}: TProps) => {
  const {content} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'ranking'>();

  const onPress = () => {
    if (!content) {
      return Alert.alert(
        'Please upload a content',
        'Upload a content to check the latest ranking.',
      );
    }

    onModal(true);
    setModal('ranking');
  };

  return (
    <View style={style}>
      <DefaultIcon icon="ranking-star" onPress={onPress} style={styles.icon} />
      {modal === 'ranking' && (
        <RankingModal
          onCancel={() => {
            onModal(false);
            setModal(undefined);
          }}
        />
      )}
    </View>
  );
};

export default RankingButton;

const styles = StyleSheet.create({icon: {alignItems: 'center'}});
