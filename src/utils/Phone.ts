import {CountryCode, parsePhoneNumber} from 'libphonenumber-js/mobile';

export const formatMobileNumber = ({
  phoneNumber,
  countryCode,
}: {
  phoneNumber: string;
  countryCode: CountryCode;
}) => {
  const parsed = parsePhoneNumber(phoneNumber, countryCode);

  if (!(parsed?.getType() === 'MOBILE')) {
    return undefined;
  }

  return parsed.number;
};
