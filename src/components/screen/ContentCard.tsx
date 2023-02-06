import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {TLocation, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getTimeSinceTimestamp} from '../../utils/Date';
import {getThumbnailPath} from '../../utils/Storage';
import DeleteButton from '../buttons/DeleteButton';
import LocationButton from '../buttons/LocationButton';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

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
      <DefaultImage
        onPress={onPress}
        image={getThumbnailPath(content.path, 'video')}
        imageStyle={contentStyle}
      />
      <View style={styles.text}>
        <View style={{flex: 1}}>
          <LocationButton location={content.location} />
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
