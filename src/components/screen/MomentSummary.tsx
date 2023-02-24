import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {TLocation, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getThumbnailPath} from '../../utils/Storage';
import DeleteButton from '../buttons/DeleteButton';
import DefaultImage from '../defaults/DefaultImage';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  moment: {
    id: string;
    contents: {
      path: string;
      addedAt: TTimestamp;
      location: TLocation;
      name: string;
      user: {id: string; displayName: string};
    }[];
  };
  style?: TStyleView;
  contentStyle: {width: number; height: number};
  onPress?: (path: string) => void;
  onDelete?: () => void;
};

const MomentSummary = ({
  moment,
  onPress,
  onDelete,
  contentStyle,
  style,
}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);

  return (
    <View style={style}>
      <ScrollView horizontal>
        {moment.contents.map(
          ({path, name, location, user: {id: elId, displayName}}) => (
            <View style={[{marginRight: 10}]} key={path}>
              <DefaultImage
                onPress={onPress ? () => onPress(path) : undefined}
                image={getThumbnailPath(path, 'video')}
                imageStyle={contentStyle}
              />
              <View
                style={{
                  flexDirection: 'row',
                  width: contentStyle.width,
                  marginTop: 5,
                }}>
                <View style={{flex: 1}}>
                  <DefaultText
                    title={displayName}
                    textStyle={{fontWeight: 'bold'}}
                  />
                  <DefaultText title={name} />
                  <DefaultText title={location.formatted} />
                </View>
                {elId === authUserData.id && (
                  <DeleteButton
                    content={{path: path}}
                    moment={{id: moment.id}}
                    onSuccess={onDelete}
                  />
                )}
              </View>
            </View>
          ),
        )}
      </ScrollView>
    </View>
  );
};

export default MomentSummary;

const styles = StyleSheet.create({
  delete: {position: 'absolute', right: 0},
});
