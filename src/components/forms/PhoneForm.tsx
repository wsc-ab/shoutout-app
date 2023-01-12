import {yupResolver} from '@hookform/resolvers/yup';
import {CountryCode, parsePhoneNumber} from 'libphonenumber-js/mobile';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, ScrollView, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {object} from 'yup';
import {defaultSchema} from '../../utils/Schema';
import DefaultDivider from '../defaults/DefaultDivider';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import FormText from '../defaults/FormText';

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
      return Alert.alert('Please retry', 'Not a valid mobile number');
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
      <KeyboardAwareScrollView>
        <DefaultText title="Enter phone number to sign in or up." />
        <DefaultDivider />
        <DefaultText
          title="Phone number"
          textStyle={{fontWeight: 'bold', fontSize: 20}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <DefaultText
            title={countryCode}
            onPress={() => setModal('code')}
            style={{
              padding: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: 'gray',
              marginTop: 5,
            }}
          />
          <FormText
            control={control}
            name="phone"
            placeholder={countryCode === 'KR' ? '01012345678' : '6501235678'}
            keyboardType="phone-pad"
            autoComplete="tel"
            style={{marginLeft: 10, flex: 1}}
            autoFocus
            errors={errors.phone}
          />
        </View>
      </KeyboardAwareScrollView>
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
                    />
                    <DefaultText
                      title="KR +82"
                      onPress={() => {
                        onChange('KR');
                        onBlur();
                        setModal(undefined);
                      }}
                      style={{marginTop: 10}}
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
