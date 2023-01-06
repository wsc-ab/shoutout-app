import React from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultImage from './DefaultImage';
import DefaultVideo from './DefaultVideo';

type TProps = {
  content: {path: string; type: string};
};

const ContentCard = ({content: {path, type}}: TProps) => {
  return (
    <>
      <View style={styles.container}>
        {type?.includes('image') && (
          <DefaultImage image={path} style={{width: 300, height: 300}} />
        )}
        {type?.includes('video') && <DefaultVideo path={path} />}
      </View>
    </>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
  },
});
