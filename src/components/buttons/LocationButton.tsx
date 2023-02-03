import React from 'react';
import {View} from 'react-native';
import {TLocation} from '../../types/Firebase';
import {TStyleView} from '../../types/Style';
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

const getCity = (location: TLocation) => {
  const types: string[] = ['political', 'locality'];

  const city = location.address?.filter(item =>
    item.types.some(type => types.includes(type)),
  )[0].short_name;

  return city;
};

const getCountry = (location: TLocation) => {
  const types: string[] = ['country'];
  const country = location.address?.filter(item =>
    item.types.some(type => types.includes(type)),
  )[0].short_name;

  return country;
};
