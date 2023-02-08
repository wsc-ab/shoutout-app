import React from 'react';
import {Controller} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  title: string;
  items: {
    title: string;
    name: string;
  }[];
  onCancel: () => void;
  onPress: (name: string) => void;
  control: any;
  name: string;
};

const Item = ({
  title,
  name,
  onPress,
  onBlur,
  onChange,
}: {
  title: string;
  name: string;
  onPress: (input: string) => void;
  onChange: (input: string) => void;
  onBlur: () => void;
}) => {
  return (
    <DefaultText
      title={title}
      onPress={() => {
        onBlur();
        onChange(name);
        onPress(name);
      }}
      style={styles.item}
    />
  );
};

const SelectModal = ({
  title,
  items,
  name,
  control,
  onPress,
  onCancel,
}: TProps) => {
  return (
    <DefaultModal>
      <DefaultForm title={title} left={{onPress: onCancel}}>
        <ScrollView>
          <Controller
            control={control}
            name={name}
            render={({field: {onChange, onBlur}}) => (
              <>
                {items.map(item => (
                  <Item
                    key={item.name}
                    {...item}
                    onChange={onChange}
                    onBlur={onBlur}
                    onPress={onPress}
                  />
                ))}
              </>
            )}
          />
        </ScrollView>
      </DefaultForm>
    </DefaultModal>
  );
};

export default SelectModal;

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
  },
});
