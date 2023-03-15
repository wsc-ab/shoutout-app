import React, {createContext, useContext, useEffect, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {defaultBlue} from '../components/defaults/DefaultColors';
import DefaultIcon from '../components/defaults/DefaultIcon';
import DefaultImage from '../components/defaults/DefaultImage';
import DefaultText from '../components/defaults/DefaultText';
import {TObject} from '../types/Firebase';
import ModalContext from './Modal';

export type TPopup = {
  title: string;
  body: string;
  target: string;
  image?: string;
  data?: TObject;
  disabled?: boolean;
};

type TContextProps = {
  addPopup: (popup: TPopup) => void;
  removePopup: ({id}: {id: string}) => void;
};

const PopupContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const PopupProvider = ({children}: TProps) => {
  const {onUpdate, modal} = useContext(ModalContext);

  const [popups, setPopups] = useState<TPopup[]>([]);

  const addPopup: TContextProps['addPopup'] = newPopup => {
    setPopups(pre => [...pre, newPopup]);
  };

  const removePopup: TContextProps['removePopup'] = ({id}) => {
    setPopups(pre => {
      const copy = [...pre];
      const filtered = copy.filter(({id: elId}) => elId !== id);
      return filtered;
    });
  };

  const shiftPopups = () =>
    setPopups(pre => {
      const copy = [...pre];
      copy.shift();

      return copy;
    });

  // dismiss popups after 5 seconds
  // only when modal is not present

  useEffect(() => {
    if (popups[0] && !modal) {
      const sub = setTimeout(() => {
        shiftPopups();
      }, 5 * 1000);
      return () => {
        clearTimeout(sub);
      };
    }
  }, [modal, popups]);

  const onPress = (popup: TPopup) => {
    console.log('called');

    onUpdate({target: popup.target, data: popup.data});

    console.log({target: popup.target, data: popup.data});

    shiftPopups();
  };

  return (
    <PopupContext.Provider
      value={{
        addPopup,
        removePopup,
      }}>
      {children}
      <SafeAreaView style={[styles.container, {zIndex: 400}]}>
        {popups[0] && (
          <Pressable
            disabled={popups[0].disabled}
            onPress={() => onPress(popups[0])}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: defaultBlue,
              flexDirection: 'row',
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              flex: 1,
              // height: 70,
            }}>
            <DefaultImage
              image={popups[0].image}
              imageStyle={{
                height: 50,
                width: 50,
              }}
              style={{marginRight: 10}}
            />
            <View style={{marginRight: 10, flex: 1}}>
              <DefaultText
                title={popups[0].title}
                textStyle={{fontWeight: 'bold'}}
              />
              <DefaultText
                title={popups[0].body}
                numberOfLines={2}
                style={{marginTop: 5}}
              />
            </View>
            <DefaultIcon
              icon="times"
              onPress={shiftPopups}
              style={{padding: 10}}
            />
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
    flexDirection: 'row',
    zIndex: 300,
  },
});
