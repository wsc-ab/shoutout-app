import React from 'react';
import {TLocation} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getCityAndCountry} from '../../utils/Map';
import DefaultText from '../defaults/DefaultText';

type TProps = {location: TLocation; style?: TStyleView};

const LocationButton = ({location, style}: TProps) => {
  if (!location.formatted) {
    return null;
  }
  return (
    <DefaultText
      title={getCityAndCountry(location.formatted)}
      style={style}
      numberOfLines={2}
    />
  );
};

export default LocationButton;
