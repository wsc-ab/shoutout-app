import React, {useContext, useEffect, useRef, useState} from 'react';
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
import {getTimeSinceTimestamp} from '../../utils/Date';
import {defaultBlack, defaultTransparentGray} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import UserModal from '../modals/UserModal';
import FollowButton from './FollowButton';
import LocationButton from './LocationButton';

type TProps = {
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

const ContributorsButton = ({users, onPress, index, style}: TProps) => {
  const {width} = useWindowDimensions();

  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.scrollToIndex({index, animated: true, viewOffset: 50});
    }
  }, [index, ref]);

  const {modal, onUpdate} = useContext(ModalContext);
  const [userId, setUserId] = useState<string>();

  return (
    <View>
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
              key={item.id + elIndex}
              onPress={() => {
                if (isCurrent) {
                  setUserId(item.id);
                  onUpdate('contributor');
                } else {
                  onPress(elIndex);
                }
              }}
              style={[
                styles.container,
                {width: (width - 30) / 2},
                isCurrent && styles.current,
              ]}>
              <View style={styles.body}>
                <DefaultText
                  title={item.displayName}
                  textStyle={styles.nameText}
                />
                <LocationButton location={item.location} />
                <DefaultText title={getTimeSinceTimestamp(item.addedAt)} />
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
      {modal === 'contributor' && userId && (
        <UserModal
          id={userId}
          onCancel={() => {
            onUpdate(undefined);
            setUserId(undefined);
          }}
        />
      )}
    </View>
  );
};

export default ContributorsButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 10,
    backgroundColor: defaultTransparentGray,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  body: {
    flex: 1,
    alignItems: 'flex-start',
  },
  contentContainer: {paddingHorizontal: 10},

  current: {backgroundColor: defaultBlack.lv2},
  nameText: {fontWeight: 'bold', fontSize: 16},
  follow: {
    marginLeft: 10,
    padding: 0,
    alignItems: 'flex-end',
  },
});
