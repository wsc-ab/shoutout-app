export const getCityAndCountry = (address: string) =>
  address.split(', ').slice(-2).join(', ');
