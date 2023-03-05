import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import ModalContext from '../../contexts/Modal';

import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import ChannelCodeForm from '../forms/ChannelCodeForm';
import ChannelSummary from '../screen/ChannelSummary';
import SearchForm from './SearchForm';

type TProps = {};

const ChannelSearchModal = ({}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  const [form, setForm] = useState<'search' | 'code'>('search');

  const renderItem = item => {
    if (item?.type === 'private') {
      return null;
    }
    return <ChannelSummary channel={{id: item.objectID}} />;
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

const styles = StyleSheet.create({textInput: {marginTop: 20}});
