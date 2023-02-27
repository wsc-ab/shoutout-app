import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type TProps = {
  children: ReactNode;
};

const DefaultKeyboardAwareScrollView = ({children}: TProps) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      indicatorStyle="white">
      {children}
    </KeyboardAwareScrollView>
  );
};

export default DefaultKeyboardAwareScrollView;

const styles = StyleSheet.create({
  container: {paddingBottom: 100, paddingHorizontal: 10},
});
