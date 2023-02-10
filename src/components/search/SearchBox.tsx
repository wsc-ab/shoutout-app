import React, {useRef} from 'react';
import {useInstantSearch, useSearchBox} from 'react-instantsearch-hooks';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import {defaultBlack, placeholderTextColor} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  style?: StyleProp<ViewStyle>;
  onChange: (value: string) => void;
  input: string;
};

const SearchBox = ({style, input, onChange}: TProps) => {
  const {query, refine} = useSearchBox();
  const {status} = useInstantSearch();

  const inputRef = useRef<TextInput>(null);

  const setQuery = (newInput: string) => {
    onChange(newInput);
    refine(newInput);
  };

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== input && !inputRef.current?.isFocused()) {
    onChange(query);
  }

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={input}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        placeholder={'Search'}
        placeholderTextColor={placeholderTextColor}
        keyboardAppearance="dark"
      />

      {!!query && !(status === 'loading' || status === 'stalled') && (
        <DefaultIcon
          style={styles.icon}
          icon="times"
          onPress={() => setQuery('')}
        />
      )}
      {(status === 'loading' || status === 'stalled') && (
        <ActivityIndicator style={styles.icon} />
      )}
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultBlack.lv3(1),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 50,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: 'white',
  },
  icon: {marginLeft: 10},
});
