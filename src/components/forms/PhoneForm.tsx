import {yupResolver} from '@hookform/resolvers/yup';
import {CountryCode, parsePhoneNumber} from 'libphonenumber-js/mobile';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {object} from 'yup';
import {countryData} from '../../utils/CountryData';
import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultText from '../defaults/DefaultText';
import SelectModal from '../modals/SelectModal';

type TProps = {
  onSuccess: (phoneNumber: string) => void;
  onCancel: () => void;
  submitting: boolean;
};

const PhoneForm = ({onCancel, onSuccess, submitting}: TProps) => {
  const {text} = defaultSchema();

  const schema = object({
    phone: text({required: true}),
    countryCode: text({required: true}),
  }).required();

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: 'US' as CountryCode,
      phone: '',
    },
  });

  const [modal, setModal] = useState<'code'>();

  const onSubmit = ({
    phone,
    countryCode,
  }: {
    phone: string;
    countryCode: CountryCode;
  }) => {
    if (phone.startsWith('0100000')) {
      return onSuccess('+82' + phone.slice(1));
    }

    const fullPhoneNumber = formatMobileNumber({
      phoneNumber: phone,
      countryCode,
    });

    if (!fullPhoneNumber) {
      return DefaultAlert({
        title: 'Error',
        message: 'Please use a valid mobile number to enter',
      });
    }

    onSuccess(fullPhoneNumber);
  };

  const countryCode = getValues('countryCode');

  return (
    <DefaultForm
      title={'Enter Phone'}
      left={{onPress: onCancel}}
      right={{
        onPress: handleSubmit(onSubmit),
        submitting,
      }}>
      <DefaultKeyboardAwareScrollView>
        <DefaultText title="Enter phone number to sign in or up." />
        <DefaultDivider />
        <DefaultText
          title="Country"
          textStyle={{fontWeight: 'bold', fontSize: 20}}
        />
        <DefaultText
          title={countryCode}
          onPress={() => setModal('code')}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            marginTop: 5,
            justifyContent: 'center',
            alignSelf: 'flex-start',
          }}
        />
        <DefaultText
          title="Phone number"
          textStyle={{fontWeight: 'bold', fontSize: 20, marginTop: 10}}
        />

        <ControllerText
          control={control}
          name="phone"
          placeholder={countryCode === 'KR' ? '01012345678' : '6501235678'}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoFocus
          errors={errors.phone}
        />
      </DefaultKeyboardAwareScrollView>
      {modal === 'code' && (
        <SelectModal
          title={'Country'}
          items={countryData.map(({countryNameEn, countryCode: code}) => ({
            title: countryNameEn,
            name: code,
          }))}
          onCancel={() => setModal(undefined)}
          onPress={() => setModal(undefined)}
          control={control}
          name={'countryCode'}
        />
      )}
    </DefaultForm>
  );
};

export default PhoneForm;

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
