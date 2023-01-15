import {yupResolver} from '@hookform/resolvers/yup';
import {CountryCode, parsePhoneNumber} from 'libphonenumber-js/mobile';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView} from 'react-native';
import {object} from 'yup';
import {defaultSchema} from '../../utils/Schema';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ControllerText from '../controllers/ControllerText';

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
      countryCode: 'KR' as CountryCode,
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
        <DefaultModal>
          <DefaultForm
            title={'Country'}
            left={{onPress: () => setModal(undefined)}}>
            <ScrollView>
              <Controller
                control={control}
                name="countryCode"
                render={({field: {onChange, onBlur}}) => (
                  <>
                    <DefaultText
                      title="US +1"
                      onPress={() => {
                        onBlur();
                        onChange('US');
                        setModal(undefined);
                      }}
                      style={{
                        padding: 20,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 10,
                      }}
                    />
                    <DefaultText
                      title="KR +82"
                      onPress={() => {
                        onChange('KR');
                        onBlur();
                        setModal(undefined);
                      }}
                      style={{
                        marginTop: 10,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 10,
                      }}
                    />
                  </>
                )}
              />
            </ScrollView>
          </DefaultForm>
        </DefaultModal>
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
