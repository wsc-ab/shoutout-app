import React, {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {TLocation, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getTimeSinceTimestamp} from '../../utils/Date';
import DeleteButton from '../buttons/DeleteButton';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultText from '../defaults/DefaultText';
import DefaultVideo from '../defaults/DefaultVideo';

type TProps = {
  content: {
    id: string;
    path: string;
    addedAt: TTimestamp;
    location?: TLocation;
    user: {id: string};
  };
  style?: TStyleView;
  contentStyle: {width: number; height: number};
  onPress?: () => void;
  onDelete?: () => void;
};

const ContentCard = ({
  content,
  onPress,
  onDelete,
  contentStyle,
  style,
}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        key={content.path}
        style={{
          height: contentStyle.height,
          width: contentStyle.width,
          backgroundColor: defaultBlack.lv3,
        }}
        disabled={!onPress}
        onPress={onPress}>
        <DefaultVideo
          path={content.path}
          style={contentStyle}
          disabled={true}
          play={false}
        />
      </Pressable>
      <View style={styles.text}>
        <View>
          {content.location && <DefaultText title={content.location.name} />}
          <DefaultText title={getTimeSinceTimestamp(content.addedAt)} />
        </View>
        {content.user.id === authUserData.id && (
          <DeleteButton
            item={content}
            style={styles.delete}
            onSuccess={onDelete}
          />
        )}
      </View>
    </View>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  delete: {paddingTop: 0},
  text: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});
