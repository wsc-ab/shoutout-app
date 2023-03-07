import React, {useContext} from 'react';
import {View} from 'react-native';
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
    addedAt: TTimestamp;
    location: TLocation;
    name: string;
    new: boolean;
    createdBy: {id: string; displayName: string};
    content: {
      path: string;
    };
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
    <View style={[{flexDirection: 'row'}, style]}>
      {moment.new && (
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
      {moment.createdBy.id === authUserData.id && (
        <DeleteButton
          content={{path: moment.content.path}}
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
        onPress={onPress ? () => onPress(moment.id) : undefined}
        image={getThumbnailPath(moment.content.path, 'video')}
        imageStyle={contentStyle}
      />

      <View
        style={{
          flexDirection: 'row',
          width: contentStyle.width,
          marginLeft: 5,
        }}>
        <View style={{flex: 1}}>
          <DefaultText title={moment.name} numberOfLines={2} />
          {moment.location.formatted && (
            <DefaultText
              title={getCityAndCountry(moment.location.formatted)}
              textStyle={{fontSize: 14, color: 'gray'}}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default MomentSummary;
