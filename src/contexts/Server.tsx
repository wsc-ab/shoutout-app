import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {version} from '../../package.json';
import DefaultAlert from '../components/defaults/DefaultAlert';
import DefaultText from '../components/defaults/DefaultText';
import {TDocSnapshot} from '../types/Firebase';
import LanguageContext from './Language';
import {localizations} from './Server.localization';
type TContextProps = {};

const ServerContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
  useEmulator: boolean;
};

const statusDocId = 'ejmzYbEP8k9Nhj6Yq7ov';

export type TServerStatus = {
  version: number;
  isLive: boolean;
  message?: {[key in 'en' | 'ko']: {title: string; detail: string}};
  clients: {
    ios: string[];
    android: string[];
    windows: string[];
    web: string[];
    macos: string[];
  };
};

const ServerProvider = ({children, useEmulator}: TProps) => {
  const [data, setData] = useState<TServerStatus>();
  const {language} = useContext(LanguageContext);
  const localization = localizations[language];

  useEffect(() => {
    if (useEmulator) {
      setData({
        version: 1,
        isLive: true,
        clients: {
          ios: [version],
          android: [version],
          windows: [version],
          web: [version],
          macos: [version],
        },
      });

      return;
    }

    const onNext = async (doc: TDocSnapshot) => {
      const statusData = doc.data() as TServerStatus;

      setData(statusData);
    };

    const onError = (error: Error) => {
      DefaultAlert({
        title: 'Failed to connect to server',
        message: (error as {message: string}).message,
      });
    };

    const unsubscribe = firestore()
      .collection('figures')
      .doc(statusDocId)
      .onSnapshot(onNext, onError);

    return unsubscribe;
  }, [useEmulator]);

  if (!data) {
    return <ActivityIndicator style={styles.container} />;
  }

  if (!data.isLive) {
    return (
      <View style={styles.container}>
        <DefaultText
          title={data.message?.[language].title ?? localization.update.title}
          textStyle={{fontWeight: 'bold'}}
        />
        <DefaultText
          title={data.message?.[language].detail ?? localization.update.detail}
          style={{marginTop: 5}}
        />
      </View>
    );
  }

  if (!data.clients[Platform.OS].includes(version)) {
    return (
      <View style={styles.container}>
        <DefaultText
          title={localization.update.title}
          textStyle={{fontWeight: 'bold'}}
        />
        <DefaultText
          title={localization.update.detail}
          style={{marginTop: 5}}
        />
      </View>
    );
  }

  return (
    <ServerContext.Provider
      value={{
        language,
      }}>
      {children}
    </ServerContext.Provider>
  );
};

export {ServerProvider};
export default ServerContext;

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', flex: 1},
});
