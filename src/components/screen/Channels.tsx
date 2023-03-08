import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {TStyleView} from '../../types/Style';
import CreateRoomButton from '../buttons/CreateChannelButton';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ChannelCodeForm from '../forms/ChannelCodeForm';
import ChannelSummary from './ChannelSummary';

type TProps = {
  style: TStyleView;
};

const Channels = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [modal, setModal] = useState<'code'>();
  const renderItem = ({item}) => {
    return <ChannelSummary channel={{id: item.id}} />;
  };

  return (
    <View style={style}>
      <FlatList
        data={authUserData.inviteFrom.items}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        indicatorStyle="white"
        ListEmptyComponent={() => (
          <View style={{marginHorizontal: 10}}>
            <DefaultText
              title="No channels"
              textStyle={{fontSize: 20, fontWeight: 'bold'}}
            />
            <DefaultText title="Create a channel or search and join public channels." />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <View style={styles.footer}>
        <CreateRoomButton style={styles.button} />
        <DefaultText
          title="Code"
          onPress={() => setModal('code')}
          textStyle={{fontWeight: 'bold'}}
          style={styles.button}
        />
      </View>
      {modal === 'code' && (
        <DefaultModal>
          <ChannelCodeForm onCancel={() => setModal(undefined)} />
        </DefaultModal>
      )}
    </View>
  );
};

export default Channels;

const styles = StyleSheet.create({
  contentContainer: {paddingBottom: 100},
  seperator: {
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 5,
  },
  button: {
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: 'gray',
    borderRadius: 20,
  },
});
