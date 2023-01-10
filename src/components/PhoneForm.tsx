import React, {useState} from 'react';
import {View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import DefaultTextInput from '../defaults/DefaultTextInput';

type TProps = {
  onSuccess: (phoneNumber: string) => void;
  onCancel: () => void;
  submitting: boolean;
};

const PhoneForm = ({onCancel, onSuccess, submitting}: TProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const onEnter = () => {
    onSuccess(phoneNumber);
  };

  return (
    <DefaultForm
      title={'Enter Phone'}
      left={{title: 'Cancel', onPress: onCancel}}
      right={{
        title: 'Done',
        onPress: onEnter,
        submitting,
      }}>
      <DefaultText title="Enter phone number to sign in or up." />
      <View style={{borderWidth: 1, borderColor: 'gray', marginVertical: 20}} />
      <DefaultTextInput
        title="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+821012345678"
        keyboardType="phone-pad"
        autoComplete="tel"
      />
    </DefaultForm>
  );
};

export default PhoneForm;
