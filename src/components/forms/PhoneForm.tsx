import {yupResolver} from '@hookform/resolvers/yup';
import {CountryCode} from 'libphonenumber-js/mobile';
import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {object} from 'yup';
import LanguageContext from '../../contexts/Language';
import {countryData} from '../../utils/CountryData';
import {formatMobileNumber} from '../../utils/Phone';
import {defaultSchema} from '../../utils/Schema';
import ControllerText from '../controllers/ControllerText';
import DefaultAlert from '../defaults/DefaultAlert';
import DefaultForm from '../defaults/DefaultForm';
import DefaultKeyboardAwareScrollView from '../defaults/DefaultKeyboardAwareScrollView';
import DefaultText from '../defaults/DefaultText';
import SelectModal from '../modals/SelectModal';
import {localizations} from './PhoneForm.localizations';

type TProps = {
  onSuccess: (phoneNumber: string) => void;
  onCancel: () => void;
  submitting: boolean;
};

const PhoneForm = ({onCancel, onSuccess, submitting}: TProps) => {
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];

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
      countryCode: (language === 'ko' ? 'KR' : 'US') as CountryCode,
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
      title={localization.title}
      left={{onPress: onCancel}}
      right={{
        onPress: handleSubmit(onSubmit),
        submitting,
      }}>
      <DefaultKeyboardAwareScrollView>
        <DefaultText title={localization.detail} style={{marginBottom: 20}} />
        <DefaultText
          title={localization.country}
          textStyle={styles.countryText}
        />
        <DefaultText
          title={countryCode}
          onPress={() => setModal('code')}
          style={styles.code}
        />
        <DefaultText
          title={localization.phoneNumber}
          textStyle={styles.numberText}
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
          title={localization.country}
          items={countryData
            .map(({countryNameEn, countryCode: code}) => ({
              title: countryNameEn,
              name: code,
            }))
            .sort((a, b) => a.title.localeCompare(b.title))}
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

const styles = StyleSheet.create({
  countryText: {fontWeight: 'bold', fontSize: 20},
  code: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  numberText: {fontWeight: 'bold', fontSize: 20, marginTop: 10},
});
