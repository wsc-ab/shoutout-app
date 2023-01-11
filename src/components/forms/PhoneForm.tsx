import {CountryCode, parsePhoneNumber} from 'libphonenumber-js/mobile';
import React, {useState} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

type TProps = {
  onSuccess: (phoneNumber: string) => void;
  onCancel: () => void;
  submitting: boolean;
};

const PhoneForm = ({onCancel, onSuccess, submitting}: TProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const [modal, setModal] = useState<'code'>();
  const [countryCode, setCountryCode] = useState<CountryCode>('KR');

  const onEnter = () => {
    if (!phoneNumber) {
      return Alert.alert('Please retry', 'Phone number not set');
    }

    if (phoneNumber.startsWith('0100000')) {
      return onSuccess('+82' + phoneNumber.slice(1));
    }
    const fullPhoneNumber = formatMobileNumber({
      phoneNumber,
      countryCode,
    });

    if (!fullPhoneNumber) {
      return Alert.alert('Please retry', 'Not a mobile number');
    }

    onSuccess(fullPhoneNumber);
  };

  return (
    <DefaultForm
      title={'Enter Phone'}
      left={{onPress: onCancel}}
      right={{
        onPress: onEnter,
        submitting,
      }}>
      <KeyboardAwareScrollView>
        <DefaultText title="Enter phone number to sign in or up." />
        <View
          style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}}
        />
        <DefaultText
          title="Phone number"
          textStyle={{fontWeight: 'bold', fontSize: 20}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
          <DefaultTextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={countryCode === 'KR' ? '01012345678' : '6501235678'}
            keyboardType="phone-pad"
            autoComplete="tel"
            style={{marginLeft: 10, flex: 1}}
            autoFocus
          />
        </View>
      </KeyboardAwareScrollView>
      {modal === 'code' && (
        <DefaultModal>
          <DefaultForm
            title={'Country'}
            left={{onPress: () => setModal(undefined)}}>
            <ScrollView>
              <DefaultText
                title="US +1"
                onPress={() => {
                  setCountryCode('US');
                  setModal(undefined);
                }}
              />
              <DefaultText
                title="KR +82"
                onPress={() => {
                  setCountryCode('KR');
                  setModal(undefined);
                }}
                style={{marginTop: 10}}
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
