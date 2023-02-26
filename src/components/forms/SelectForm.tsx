import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet} from 'react-native';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultForm from '../defaults/DefaultForm';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  data: {id: string; name: string; collection: string}[];
  onSuccess: (ids: string[]) => void;
  onCancel: () => void;
  title: string;
  min?: number;
  max?: number;
};

const SelectForm = ({title, onSuccess, onCancel, data, min, max}: TProps) => {
  const [ids, setIds] = useState<string[]>([]);

  const onPress = (id: string) => {
    setIds(pre => {
      const copy = [...pre];

      // find index
      const index = copy.findIndex(elId => elId === id);

      // if item is not found
      // add it
      if (index === -1) {
        return [...copy, id];
      } else {
        // if found is not found
        // remove it
        copy.splice(index, 1);
        return copy;
      }
    });
  };

  const renderItem = ({
    item: {id, name},
  }: {
    item: {id: string; name: string};
  }) => (
    <Pressable
      style={[styles.container, ids.includes(id) && styles.selected]}
      onPress={() => onPress(id)}>
      <UserProfileImage user={{id}} />
      <DefaultText title={name} style={styles.displayName} />
    </Pressable>
  );

  const onSubmit = () => {
    if (min && ids.length < min) {
      return DefaultAlert({
        title: 'Too few',
        message: `Select at least ${min}.`,
      });
    }

    if (max && ids.length < max) {
      return DefaultAlert({
        title: 'Too many',
        message: `Select at most ${max}.`,
      });
    }

    onSuccess(ids);
  };

  return (
    <DefaultForm
      title={title}
      left={{
        onPress: onCancel,
      }}
      right={{
        onPress: onSubmit,
      }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        style={{padding: 10}}
        indicatorStyle="white"
        ListEmptyComponent={
          <DefaultText
            title="This list is empty."
            textStyle={{fontWeight: 'bold'}}
          />
        }
        ListHeaderComponent={
          <DefaultText
            title="Select friends for your new room."
            style={{marginBottom: 20}}
          />
        }
      />
    </DefaultForm>
  );
};

export default SelectForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    borderColor: 'gray',
    marginBottom: 10,
  },
  displayName: {marginLeft: 10, flex: 1},
  selected: {borderColor: defaultRed.lv2},
});
