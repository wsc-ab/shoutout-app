import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';

import ModalContext from '../../contexts/Modal';
import SmallUserCard from '../cards/SmallUserCard';

type TProps = {
  users: {
    id: string;
    displayName: string;
    thumbnail?: string;
    added: boolean;
  }[];
};

const UsersModal = ({users}: TProps) => {
  const {onUpdate} = useContext(ModalContext);
  return (
    <DefaultModal style={{zIndex: 200}}>
      <DefaultForm
        title={'Users'}
        left={{
          onPress: () => onUpdate(undefined),
        }}>
        <FlatList
          data={users}
          contentContainerStyle={styles.container}
          keyExtractor={item => item.id}
          renderItem={({
            item,
          }: {
            item: {
              id: string;
              displayName: string;
              thumbnail?: string;
            };
          }) => {
            return (
              <SmallUserCard id={item.id} displayName={item.displayName} />
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
        />
      </DefaultForm>
    </DefaultModal>
  );
};

export default UsersModal;

const styles = StyleSheet.create({
  container: {paddingBottom: 100},
  seperator: {
    marginBottom: 20,
  },
});
