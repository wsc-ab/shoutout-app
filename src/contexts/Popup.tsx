import {IconProp} from '@fortawesome/fontawesome-svg-core';
import React, {createContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {defaultBlue} from '../components/defaults/DefaultColors';
import DefaultIcon from '../components/defaults/DefaultIcon';
import DefaultText from '../components/defaults/DefaultText';

type TPopup = {
  title?: string;
  icon?: IconProp;
  submitting?: boolean;
  onPress?: () => void;
  dismissable: boolean;
};

type TContextProps = {
  addPopup: (popup: TPopup) => void;
};

const PopupContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const PopupProvider = ({children}: TProps) => {
  const [popups, setPopups] = useState<TPopup[]>([]);

  const addPopup: TContextProps['addPopup'] = newPopup => {
    setPopups(pre => [...pre, newPopup]);
  };

  const shiftPopups = () =>
    setPopups(pre => {
      const copy = [...pre];
      copy.shift();

      return copy;
    });

  useEffect(() => {
    if (popups[0]?.dismissable) {
      const sub = setTimeout(() => {
        shiftPopups();
      }, 5 * 1000);

      return () => {
        clearTimeout(sub);
      };
    }
  }, [popups]);

  const onPress = () => {
    if (popups[0].onPress) {
      popups[0].onPress();
    }

    shiftPopups();
  };

  return (
    <PopupContext.Provider
      value={{
        addPopup,
      }}>
      {children}
      <SafeAreaView style={styles.container}>
        {popups[0] && (
          <Pressable
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              padding: 10,
              backgroundColor: defaultBlue,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              alignSelf: 'stretch',
              flexDirection: 'row',
            }}>
            <DefaultIcon icon={popups[0].icon} style={{marginRight: 5}} />
            <DefaultText
              title={popups[0].title}
              style={{marginRight: 5}}
              textStyle={{fontWeight: 'bold'}}
            />
            {popups[0].submitting && <ActivityIndicator color={'white'} />}
          </Pressable>
        )}
      </SafeAreaView>
    </PopupContext.Provider>
  );
};

export {PopupProvider};
export default PopupContext;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
