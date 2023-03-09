import React, {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TStyleView} from '../../types/Style';
import {getTimeGap} from '../../utils/Date';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  id: string;
  displayName: string;
  style?: TStyleView;
  moment?: {addedAt: boolean};
  index: number;
};

const SmallUserCard = ({id, index, displayName, moment, style}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  return (
    <Pressable
      onPress={() => onUpdate({target: 'user', data: {id}})}
      style={style}>
      <View style={styles.body}>
        <DefaultText
          title={moment ? (index + 1).toString() : '-'}
          style={{marginRight: 10}}
          textStyle={{fontWeight: 'bold', fontSize: 30}}
        />
        <UserProfileImage user={{id}} />
        <View style={{marginLeft: 10}}>
          <DefaultText
            title={displayName}
            style={styles.displayName}
            textStyle={styles.displayNameText}
          />
          {moment && (
            <DefaultText
              title={`${getTimeGap(moment.addedAt)} ago`}
              textStyle={{fontSize: 14, color: 'lightgray'}}
            />
          )}
          {!moment && <DefaultText title={'Not shared'} />}
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
  displayName: {marginBottom: 5},
  displayNameText: {fontWeight: 'bold'},
});
