import React, {createContext} from 'react';
import {NativeModules, Platform} from 'react-native';

type TContextProps = {
  language: 'en' | 'ko';
};

const LanguageContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const LanguageProvider = ({children}: TProps) => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLanguages[0] || // iOS 13
        NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier;

  const language = deviceLanguage.startsWith('ko') ? 'ko' : 'en';

  return (
    <LanguageContext.Provider
      value={{
        language,
      }}>
      {children}
    </LanguageContext.Provider>
  );
};

export {LanguageProvider};
export default LanguageContext;
