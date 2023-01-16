import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultIcon from '../defaults/DefaultIcon';
import RankModal from '../modals/RankModal';

type TProps = {style: TStyleView; onModal: (visible: boolean) => void};

const RankButton = ({style, onModal}: TProps) => {
  const {content} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'rank'>();

  const onPress = () => {
    if (!content) {
      return DefaultAlert({
        title: 'Please share a content',
        message: 'Share a content to check the latest rank.',
      });
    }

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
