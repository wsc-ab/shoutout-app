import React, {useContext} from 'react';
import ModalContext from '../../contexts/Modal';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import SearchForm from '../modals/SearchForm';
import ChannelSearch from './ChannelSearch';

type TProps = {};

const ChannelSearchModal = ({}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  const renderItem = item => {
    if (item.options.type === 'private') {
      return null;
    }

    return <ChannelSearch channel={item} key={item.objectID} />;
  };

  return (
    <DefaultModal>
      <DefaultForm
        title={'Search'}
        left={{
          onPress: () => onUpdate(undefined),
        }}>
        <SearchForm indexes={[{name: 'channels'}]} renderItem={renderItem} />
      </DefaultForm>
    </DefaultModal>
  );
};

export default ChannelSearchModal;
