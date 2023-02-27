import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {defaultBlue} from '../components/defaults/DefaultColors';
import DefaultImage from '../components/defaults/DefaultImage';
import DefaultText from '../components/defaults/DefaultText';
import ModalContext from './Modal';

type TPopup = {
  id: string;
  title: string;
  body: string;
  image?: string;
  target?: string;
  data?: {id: string};
  disabled?: boolean;
};

type TUpload = {
  id: string;
  localPath: string;
};

type TContextProps = {
  addPopup: (popup: TPopup) => void;
  removePopup: ({id}: {id: string}) => void;
  addUpload: (upload: TUpload) => void;
  removeUpload: ({id}: {id: string}) => void;
  uploading: boolean;
};

const PopupContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const PopupProvider = ({children}: TProps) => {
  const {onUpdate, modal} = useContext(ModalContext);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<TUpload[]>([]);
  const [popups, setPopups] = useState<TPopup[]>([]);

  const addUpload: TContextProps['addUpload'] = newUpload => {
    setUploads(pre => [...pre, newUpload]);
  };

  useEffect(() => {
    setUploading(uploads.length >= 1);
  }, [uploads]);

  const removeUpload: TContextProps['removeUpload'] = ({id}) => {
    setUploads(pre => {
      const copy = [...pre];
      const filtered = copy.filter(({id: elId}) => elId !== id);
      return filtered;
    });
  };

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

  const onPress = () => {
    if (popups[0].target) {
      onUpdate({target: popups[0].target, data: popups[0].data});
    }

    shiftPopups();
  };

  return (
    <PopupContext.Provider
      value={{
        addPopup,
        removePopup,
        addUpload,
        removeUpload,
        uploading,
      }}>
      {children}
      <SafeAreaView style={styles.container}>
        {popups[0] && (
          <Pressable
            disabled={popups[0].disabled}
            onPress={onPress}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: defaultBlue,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              flexDirection: 'row',
            }}>
            <DefaultImage
              image={popups[0].image}
              imageStyle={{
                height: 50,
                width: 50,
              }}
              style={{marginRight: 5}}
            />
            <View style={{marginRight: 5}}>
              <DefaultText
                title={popups[0].title}
                textStyle={{fontWeight: 'bold'}}
              />
              <DefaultText title={popups[0].body} />
            </View>
          </Pressable>
        )}
        <View style={{flex: 1}} />
        {uploads.length >= 1 && (
          <View
            style={{
              padding: 10,
              backgroundColor: defaultBlue,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              flexDirection: 'row',
              alignSelf: 'flex-start',
            }}>
            <ActivityIndicator color={'white'} />
          </View>
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
