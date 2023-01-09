import React, {useState} from 'react';
import DefaultModal from '../defaults/DefaultModal';
import {checkPhoneNumber} from '../functions/User';
import PhoneForm from './PhoneForm';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

type TProps = {
  onCancel: () => void;
};

const EnterModal = ({onCancel}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<'enter' | 'signIn' | 'signUp'>('enter');
  const [phoneNumber, setPhoneNumber] = useState('');
  const onEnter = async (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    setSubmitting(true);

    const {status} = await checkPhoneNumber({user: {phoneNumber}});

    if (status === 'signedUp') {
      setForm('signIn');
    } else {
      setForm('signUp');
    }

    setSubmitting(false);
  };

  return (
    <DefaultModal>
      {form === 'enter' && (
        <PhoneForm
          onSuccess={onEnter}
          onCancel={onCancel}
          submitting={submitting}
        />
      )}
      {form === 'signIn' && (
        <SignInForm
          phoneNumber={phoneNumber}
          onCancel={() => setForm('enter')}
        />
      )}
      {form === 'signUp' && (
        <SignUpForm
          phoneNumber={phoneNumber}
          onCancel={() => setForm('enter')}
        />
      )}
    </DefaultModal>
  );
};

export default EnterModal;
