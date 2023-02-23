import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';

import ModalContext from '../../contexts/Modal';
import {TObject, TTimestamp, TTimestampClient} from '../../types/Firebase';
import SmallUserCard from '../cards/SmallUserCard';

type TProps = {
  users: {
    id: string;
    displayName: string;
    thumbnail?: string;
    moment?: {addedAt: TTimestampClient};
  }[];
};

const UsersModal = ({users}: TProps) => {
  const {onUpdate} = useContext(ModalContext);

  console.log(users[0].moment?.addedAt);

  const sortByAddedAt = users.sort((a, b) => {
    if (!a.moment?.addedAt._seconds) {
      return 1;
    }

    if (!b.moment?.addedAt._seconds) {
      return -1;
    }
    return a.moment.addedAt._seconds - b.moment.addedAt._seconds;
  });

  return (
    <DefaultModal style={{zIndex: 200}}>
      <DefaultForm
        title={'Users'}
        left={{
          onPress: () => onUpdate(undefined),
        }}>
        <FlatList
          data={sortByAddedAt}
          contentContainerStyle={styles.container}
          keyExtractor={item => item.id}
          renderItem={({
            item,
          }: {
            item: {
              id: string;
              displayName: string;
              thumbnail?: string;
              moment: {addedAt: TTimestamp};
            };
          }) => {
            return (
              <SmallUserCard
                {...item}
                style={{
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 10,
                }}
              />
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
