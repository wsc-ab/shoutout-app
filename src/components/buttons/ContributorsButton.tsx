import React, {useEffect, useRef} from 'react';
import {FlatList, Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import {TTimestamp} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import FollowButton from './FollowButton';

type TProps = {
  users: {
    name: string;
    id: string;
    thumbnail?: string;
    location?: {name: string};
    addedAt: TTimestamp;
  }[];
  index: number;
  style?: ViewStyle;
  onPress: (index: number) => void;
};

const ContributorsButton = ({users, onPress, index, style}: TProps) => {
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.scrollToIndex({index, animated: true, viewOffset: 50});
    }
  }, [index, ref]);

  return (
    <FlatList
      data={users}
      style={style}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      renderItem={({item, index: elIndex}) => {
        const isCurrent = elIndex === index;
        return (
          <Pressable
            onPress={() => onPress(elIndex)}
            style={[styles.container, isCurrent && styles.current]}
            key={item.id + elIndex}>
            <View>
              <DefaultIcon icon="user" style={styles.icon} />
            </View>
            <View>
              <DefaultText title={item.name} textStyle={styles.nameText} />
              <DefaultText title={getTimeSinceTimestamp(item.addedAt)} />
              {item.location && <DefaultText title={item.location.name} />}
            </View>
            <FollowButton
              user={{
                id: item.id,
              }}
              style={styles.follow}
            />
          </Pressable>
        );
      }}
      keyExtractor={(item, elIndex) => item.id + elIndex}
      ref={ref}
    />
  );
};

export default ContributorsButton;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginRight: 10,
    padding: 10,
    backgroundColor: defaultBlack.lv5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentContainer: {paddingHorizontal: 10},
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginRight: 5,
    backgroundColor: defaultBlack.lv3,
  },
  current: {backgroundColor: defaultBlack.lv2},
  nameText: {fontWeight: 'bold'},
  follow: {marginLeft: 10},
});
