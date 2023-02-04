import React from 'react';
import {View} from 'react-native';
import {TLocation} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
import {getCity, getCountry} from '../../utils/Map';
import DefaultText from '../defaults/DefaultText';

type TProps = {location?: TLocation; style?: TStyleView};

const AddressButtion = ({location, style}: TProps) => {
  if (!location) {
    return null;
  }
  const city = getCity(location);
  const country = getCountry(location);
  return (
    <View style={style}>
      <DefaultText title={`${city}, ${country}`} />
    </View>
  );
};

export default AddressButtion;
