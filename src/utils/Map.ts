import {TLocation} from '../types/Firebase';

export const getCity = (location: TLocation) => {
  const types: string[] = ['administrative_area_level_1', 'locality'];

  const city = location.address?.filter(item =>
    item.types.some(type => types.includes(type)),
  )[0].short_name;

  return city;
};

export const getCountry = (location: TLocation) => {
  const types: string[] = ['country'];
  const country = location.address?.filter(item =>
    item.types.some(type => types.includes(type)),
  )[0].short_name;

  return country;
};
