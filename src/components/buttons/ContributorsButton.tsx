import React, {useContext, useEffect, useRef} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {TTimestamp} from '../../types/Firebase';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import FollowButton from './FollowButton';
import LocationButton from './LocationButton';

type TProps = {
  type: string;
  users: {
    displayName: string;
    id: string;
    thumbnail?: string;
    location?: {name: string};
    addedAt: TTimestamp;
  }[];

  index: number;
  style?: ViewStyle;
  onPress: (index: number) => void;
};

const ContributorsButton = ({type, users, onPress, index, style}: TProps) => {
  const {width} = useWindowDimensions();
  const {authUserData} = useContext(AuthUserContext);

  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.scrollToIndex({index, animated: true, viewOffset: 50});
    }
  }, [index, ref]);

  const {onUpdate} = useContext(ModalContext);

  const contributed = users.map(({id}) => id).includes(authUserData.id);

  return (
    <View style={style}>
      <View style={styles.type}>
        <DefaultText title={`For ${type}`} />
        {contributed && (
          <DefaultText title={'You are connected to this moment.'} />
        )}
      </View>
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
                  onUpdate({target: 'users', id: item.id});
                } else {
                  onPress(elIndex);
                }
              }}
              style={[
                styles.container,
                {width: (width - 80) / 2},
                isCurrent && styles.current,
              ]}>
              <DefaultText
                title={item.displayName}
                textStyle={styles.nameText}
              />
              <LocationButton location={item.location} />
              <DefaultText title={getTimeSinceTimestamp(item.addedAt)} />
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
    </View>
  );
};

export default ContributorsButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 10,
    backgroundColor: defaultBlack.lv2(0.5),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentContainer: {paddingHorizontal: 10},
  current: {backgroundColor: defaultBlack.lv2(0.9)},
  nameText: {fontWeight: 'bold', fontSize: 16},
  follow: {
    marginTop: 5,
  },
  type: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
