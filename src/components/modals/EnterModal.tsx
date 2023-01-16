import React, {useState} from 'react';

import {checkPhoneNumber} from '../../functions/User';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultModal from '../defaults/DefaultModal';
import PhoneForm from '../forms/PhoneForm';
import SignInForm from '../forms/SignInForm';
import SignUpForm from '../forms/SignUpForm';

type TProps = {
  onCancel: () => void;
};

const EnterModal = ({onCancel}: TProps) => {
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<'enter' | 'signIn' | 'signUp'>('enter');
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const onEnter = async (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);

    try {
      setSubmitting(true);
      const {
        user: {status},
      } = await checkPhoneNumber({
        user: {phoneNumber: newPhoneNumber},
      });
      console.log(status, 'status');

      setSubmitting(false);

      switch (status) {
        case 'signedUp':
          setForm('signIn');
          break;

        case 'new':
          setForm('signUp');
          break;

        case 'deleted':
          DefaultAlert({
            title: 'deleted number',
            message:
              'If you want to restore this number, send an email to hello@airballoon.app',
          });

          break;

        default:
          break;
      }
    } catch (error) {
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setSubmitting(false);
    }
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
