import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import LanguageContext from '../../contexts/Language';
import {sendNoti} from '../../functions/Channel';
import {TStyleView} from '../../types/Style';
import CreateChannelButton from '../buttons/CreateChannelButton';
import DefaultModal from '../defaults/DefaultModal';
import DefaultText from '../defaults/DefaultText';
import ChannelCodeForm from '../forms/ChannelCodeForm';
import {localizations} from './Channels.localizations';
import ChannelSummary from './ChannelSummary';
import EmptyChannel from './EmptyChannel';

type TProps = {
  style: TStyleView;
};

const Channels = ({style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];
  const [modal, setModal] = useState<'code'>();
  const renderItem = ({item}: {item: {id: string}}) => {
    return <ChannelSummary channel={{id: item.id}} />;
  };

  return (
    <View style={style}>
      <FlatList
        data={authUserData.inviteFrom.items}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        indicatorStyle="white"
        ListEmptyComponent={EmptyChannel}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
      />
      <View style={styles.footer}>
        <CreateChannelButton style={styles.button} />
        <DefaultText
          title={localization.code}
          onPress={() => setModal('code')}
          textStyle={styles.codeText}
          style={styles.button}
        />
        <DefaultText
          title={'Notify'}
          onPress={sendNoti}
          textStyle={styles.codeText}
          style={styles.button}
        />
      </View>
      {modal === 'code' && (
        <DefaultModal>
          <ChannelCodeForm
            onCancel={() => setModal(undefined)}
            onSuccess={() => setModal(undefined)}
          />
        </DefaultModal>
      )}
    </View>
  );
};

export default Channels;

const styles = StyleSheet.create({
  contentContainer: {paddingBottom: 100, paddingHorizontal: 20},
  seperator: {
    marginVertical: 10,
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
  codeText: {fontWeight: 'bold'},
});
