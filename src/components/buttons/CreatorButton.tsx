import React, {useContext} from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TDocData} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import DefaultText from '../defaults/DefaultText';
import UserModal from '../modals/UserModal';

type TProps = {
  moment: TDocData;
  style?: ViewStyle;
};

const CreatorButton = ({moment, style}: TProps) => {
  const {onUpdate, modal} = useContext(ModalContext);

  return (
    <View style={style}>
      <Pressable onPress={() => onUpdate('user')}>
        <DefaultText title={moment.contributeFrom?.items[0].name} />
        {moment.location?.name && <DefaultText title={moment.location.name} />}
        <DefaultText title={getTimeSinceTimestamp(moment.createdAt)} />
      </Pressable>
      {modal === 'user' && (
        <UserModal
          id={moment.contributeFrom?.items[0].id}
          onCancel={() => onUpdate(undefined)}
        />
      )}
    </View>
  );
};

export default CreatorButton;
