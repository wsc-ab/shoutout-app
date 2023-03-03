import React, {useContext} from 'react';
import {ScrollView, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';

import {TLocation, TTimestamp} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getCityAndCountry} from '../../utils/Map';
import {getThumbnailPath} from '../../utils/Storage';
import DeleteButton from '../buttons/DeleteButton';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
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
      new: boolean;
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {moment.contents.map(
          ({
            path,
            new: newContent,
            name,
            location,
            user: {id: elId, displayName},
          }) => (
            <View style={[{marginRight: 10}]} key={path}>
              {newContent && (
                <DefaultIcon
                  icon="circle"
                  color={defaultRed.lv1}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 100,
                    padding: 10,
                  }}
                />
              )}
              {elId === authUserData.id && (
                <DeleteButton
                  content={{path: path}}
                  moment={{id: moment.id}}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 100,
                    padding: 10,
                  }}
                  onSuccess={onDelete}
                />
              )}

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
                    textStyle={{fontWeight: 'bold', fontSize: 16}}
                  />
                  <DefaultText title={name} numberOfLines={2} />
                  {location.formatted && (
                    <DefaultText
                      title={getCityAndCountry(location.formatted)}
                      textStyle={{fontSize: 14, color: 'gray'}}
                    />
                  )}
                </View>
              </View>
            </View>
          ),
        )}
      </ScrollView>
    </View>
  );
};

export default MomentSummary;
