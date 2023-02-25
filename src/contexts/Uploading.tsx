import React, {createContext, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import UploadButton from '../components/buttons/UploadButton';
import {defaultBlue} from '../components/defaults/DefaultColors';
import {TObject} from '../types/Firebase';

type TTarget = {
  collection: string;
  id: string;
  data: TObject;
};

type TContextProps = {
  target?: TTarget;
  status: 'ready' | 'uploading' | 'error' | 'done';
  onUpload: ({
    target,
    status,
  }: {
    target: TTarget;
    status: TContextProps['status'];
  }) => void;
};

const UploadingContext = createContext({} as TContextProps);

export type TProps = {
  children: React.ReactNode;
};

const UploadingProvider = ({children}: TProps) => {
  const [target, setTarget] = useState<TContextProps['target']>();
  const [status, setStatus] = useState<TContextProps['status']>('ready');

  const onUpload: TContextProps['onUpload'] = ({
    target: newTarget,
    status: newStatus,
  }) => {
    setStatus(newStatus);
    setTarget(newStatus === 'ready' ? undefined : newTarget);
  };

  return (
    <UploadingContext.Provider
      value={{
        target,
        status,
        onUpload,
      }}>
      {children}
      <SafeAreaView style={styles.container}>
        {status === 'uploading' && target && (
          <UploadButton
            style={styles.button}
            localPath={target.data.localPath}
          />
        )}
      </SafeAreaView>
    </UploadingContext.Provider>
  );
};

export {UploadingProvider};
export default UploadingContext;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: defaultBlue,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'stretch',
  },
});
