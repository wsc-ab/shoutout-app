import React from 'react';
import {TLocation} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import DefaultText from '../defaults/DefaultText';

type TProps = {location?: TLocation; style?: TStyleView};

const LocationButton = ({location, style}: TProps) => {
  return (
    <DefaultText
      title={location?.formatted ?? 'Earth'}
      style={style}
      numberOfLines={2}
    />
  );
};

export default LocationButton;
