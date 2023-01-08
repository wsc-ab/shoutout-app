import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultForm from '../defaults/DefaultForm';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';

type TProps = {
  onCancel: () => void;
};

const BestModal = ({onCancel}: TProps) => {
  type TTab = 'Day' | 'Week' | 'Month' | 'Year';
  const tabs: TTab[] = ['Day', 'Week', 'Month', 'Year'];
  const [tab, setTab] = useState<TTab>(tabs[0]);

  return (
    <DefaultModal>
      <DefaultForm title={'Best'} left={{title: 'Back', onPress: onCancel}}>
        <DefaultText title={'Checkout the best contents.'} />
        <View style={styles.tabs}>
          {tabs.map(el => {
            const borderBottomWidth = tab === el ? 1 : 0;
            return (
              <DefaultText
                key={el}
                title={el}
                style={[styles.tab, {borderBottomWidth}]}
                onPress={setTab}
              />
            );
          })}
        </View>
      </DefaultForm>
    </DefaultModal>
  );
};

export default BestModal;

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    borderColor: 'white',
    marginHorizontal: 20,
  },
});
