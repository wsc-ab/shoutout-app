import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  id: string;
  displayName: string;
  thumbnail?: string;
};

const SmallUserCard = ({id, displayName, thumbnail}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      onPress={() => onUpdate({target: 'users', id})}
      style={{
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
      }}>
      <DefaultIcon
        icon="user"
        style={{
          borderRadius: 20,
          flexDirection: 'row',
          backgroundColor: defaultBlack.lv2(1),
          marginRight: 5,
        }}
      />
      <DefaultText
        title={displayName}
        style={{marginBottom: 5}}
        textStyle={{fontWeight: 'bold'}}
      />
    </Pressable>
  );
};

export default SmallUserCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    marginBottom: 10,
  },
  displayName: {marginLeft: 5, flex: 1},
});
