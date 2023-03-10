import React from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  user: {
    displayName: string;
    id: string;
  };
  style?: ViewStyle;
  index: number;
  length: number;
};

const ContributorButton = ({user, index, length, style}: TProps) => {
  const {width} = useWindowDimensions();

  return (
    <View style={style}>
      <Pressable style={[styles.container, {width: (width - 80) / 1.5}]}>
        <View style={styles.user}>
          <UserProfileImage
            user={{
              id: user.id,
            }}
          />
          <View style={styles.texts}>
            <DefaultText title={user.displayName} textStyle={styles.nameText} />
            <DefaultText
              title={`${index + 1} / ${length}`}
              textStyle={{fontWeight: 'bold'}}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ContributorButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    padding: 10,
    backgroundColor: defaultBlack.lv3(0.5),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  nameText: {fontWeight: 'bold', fontSize: 16},
  user: {flexDirection: 'row', flex: 1},
  texts: {marginLeft: 5, flex: 1},
});
