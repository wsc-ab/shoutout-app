import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import ModalContext from '../../contexts/Modal';
import {addChannelUsers} from '../../functions/Channel';
import DefaultForm from '../defaults/DefaultForm';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ChannelCodeForm from '../forms/ChannelCodeForm';
import ChannelSearch from './ChannelSearch';
import SearchForm from './SearchForm';

type TProps = {};

const ChannelSearchModal = ({}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const {authUserData} = useContext(AuthUserContext);
  const [form, setForm] = useState<'search' | 'code'>('search');

  const renderItem = item => {
    if (item.options.type === 'private') {
      return null;
    }

    return <ChannelSearch channel={item} />;
  };

  return (
    <DefaultModal>
      {form === 'search' && (
        <DefaultForm
          title={'Search'}
          left={{
            onPress: () => onUpdate(undefined),
          }}
          right={{
            icon: 'plus',
            onPress: () => setForm('code'),
          }}>
          <SearchForm indexes={[{name: 'channels'}]} renderItem={renderItem} />
        </DefaultForm>
      )}
      {form === 'code' && (
        <ChannelCodeForm onCancel={() => setForm('search')} />
      )}
    </DefaultModal>
  );
};

export default ChannelSearchModal;
