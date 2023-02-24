import React, {useContext, useEffect, useRef} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import ModalContext from '../../contexts/Modal';
import {TTimestamp} from '../../types/Firebase';
import {getTimeGap} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../defaults/UserProfileImage';
import LocationButton from './LocationButton';

type TProps = {
  users: {
    displayName: string;
    id: string;
    location?: {name: string};
    addedAt: TTimestamp;
  }[];
  type: string;
  index: number;
  style?: ViewStyle;
  onPress: (index: number) => void;
};

const ContributorsButton = ({users, type, onPress, index, style}: TProps) => {
  const {width} = useWindowDimensions();

  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.scrollToIndex({index, animated: true, viewOffset: 50});
    }
  }, [index, ref]);

  const {onUpdate} = useContext(ModalContext);

  return (
    <View style={style}>
      <DefaultText
        title={`For ${type}`}
        textStyle={styles.nameText}
        style={{paddingLeft: 20, marginBottom: 5}}
      />
      <FlatList
        data={users}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item, index: elIndex}) => {
          const isCurrent = elIndex === index;
          return (
            <Pressable
              key={item.id + elIndex}
              onPress={() => {
                if (isCurrent) {
                  onUpdate({target: 'user', data: {id: item.id}});
                } else {
                  onPress(elIndex);
                }
              }}
              style={[
                styles.container,
                {width: (width - 80) / 1.5},
                isCurrent && styles.current,
                elIndex === users.length - 1 && styles.isLast,
              ]}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <UserProfileImage
                  user={{
                    id: item.id,
                  }}
                />
                <View style={{marginLeft: 5, flex: 1}}>
                  <DefaultText
                    title={item.displayName}
                    textStyle={{fontWeight: 'bold'}}
                  />
                  <LocationButton location={item.location} />
                  <DefaultText title={getTimeGap(item.addedAt) + ' ago'} />
                </View>
              </View>
            </Pressable>
          );
        }}
        keyExtractor={(item, elIndex) => item.id + elIndex}
        ref={ref}
      />
    </View>
  );
};

export default ContributorsButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 10,
    backgroundColor: defaultBlack.lv3(0.5),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentContainer: {paddingHorizontal: 20},
  current: {backgroundColor: defaultBlack.lv3(0.9)},
  nameText: {fontWeight: 'bold', fontSize: 16},
  isLast: {marginRight: 0},
});
