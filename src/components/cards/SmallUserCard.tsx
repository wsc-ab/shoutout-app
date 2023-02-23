import React, {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {getTimeGap} from '../../utils/Date';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  displayName: string;
  thumbnail?: string;
  style?: TStyleView;
  moment?: {addedAt: boolean};
};

const SmallUserCard = ({id, displayName, moment, style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      onPress={() => onUpdate({target: 'users', data: {id}})}
      style={style}>
      <View style={styles.body}>
        <DefaultIcon icon="user" style={styles.icon} />
        <View>
          <DefaultText
            title={displayName}
            style={styles.displayName}
            textStyle={styles.displayNameText}
          />
          {moment && (
            <DefaultText title={`${getTimeGap(moment.addedAt)} ago`} />
          )}
          {!moment && <DefaultText title={'Not Added'} />}
        </View>
      </View>
    </Pressable>
  );
};

export default SmallUserCard;

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    marginRight: 10,
  },
  displayName: {marginBottom: 5},
  displayNameText: {fontWeight: 'bold'},
});
