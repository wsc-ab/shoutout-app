import React, {createContext, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {defaultBlack} from '../components/defaults/DefaultColors';
import DefaultIcon from '../components/defaults/DefaultIcon';
import DefaultText from '../components/defaults/DefaultText';

type TContent = {
  remotePath: string;
  localPath: string;
  type: 'createPrompt' | 'addMoment' | 'addContent';
};

type TContextProps = {
  contents: TContent[];
  addUpload: (content: TContent) => void;
  removeUpload: (content: TContent) => void;
  promptUpdated: boolean;
};

const UploadingContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const UploadingProvider = ({children}: TProps) => {
  const [contents, setContents] = useState<TContent[]>([]);
  const [status, setstatus] = useState<'started' | 'ended'>();
  const [promptUpdated, setPromptUpdated] = useState(false);

  const addUpload = (newContent: TContent) => {
    setstatus('started');
    setContents(pre => [...pre, newContent]);
    setTimeout(() => {
      setstatus(undefined);
    }, 3000);
  };

  const removeUpload = ({remotePath, type}: TContent) => {
    setstatus('ended');
    setContents(pre =>
      pre.filter(({remotePath: elRemotePath}) => elRemotePath !== remotePath),
    );

    if (type === 'createPrompt' || type === 'addMoment') {
      setPromptUpdated(true);
      setPromptUpdated(false);
    }
    setTimeout(() => {
      setstatus(undefined);
    }, 3000);
  };

  return (
    <UploadingContext.Provider
      value={{
        contents,
        addUpload,
        removeUpload,
        promptUpdated,
      }}>
      {children}
      {status && (
        <SafeAreaView style={styles.container}>
          {status === 'started' && (
            <View style={styles.box}>
              <DefaultText
                title="Started to upload your moment!"
                style={styles.text}
              />
              <DefaultIcon icon="times" onPress={() => setstatus(undefined)} />
            </View>
          )}
        </SafeAreaView>
      )}
    </UploadingContext.Provider>
  );
};

export {UploadingProvider};
export default UploadingContext;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 100,
  },
  box: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: defaultBlack.lv3(50),
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  text: {flex: 1},
});
