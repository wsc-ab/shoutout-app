import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {addShoutout, removeShoutout} from '../../functions/Content';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {collection: string; id: string; style?: TStyleView};

const ShoutoutButton = ({collection, id, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const [isLoading, setIsLoading] = useState(false);

  const onShoutout = async () => {
    try {
      setIsLoading(true);

      setIsShoutouted(true);
      await addShoutout({content: {id}});
    } catch (error) {
      if ((error as {message: string}).message === "content doesn't exist") {
        DefaultAlert({
          title: 'Deleted content',
        });
      } else {
        DefaultAlert({
          title: 'Error',
          message: (error as {message: string}).message,
        });
      }
      setIsShoutouted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnshoutout = async () => {
    try {
      setIsLoading(true);

      setIsShoutouted(false);
      await removeShoutout({
        content: {id},
      });
    } catch (error) {
      setIsShoutouted(false);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isShoutouted, setIsShoutouted] = useState(false);

  useEffect(() => {
    setIsShoutouted(authUserData.shoutoutTo?.[collection]?.ids.includes(id));
  }, [authUserData.shoutoutTo, collection, id]);

  return (
    <View style={style}>
      {!isLoading && (
        <DefaultIcon
          icon="heart"
          onPress={isShoutouted ? onUnshoutout : onShoutout}
          style={styles.icon}
          color={isShoutouted ? defaultRed.lv1 : 'white'}
        />
      )}
      {isLoading && <ActivityIndicator style={styles.icon} />}
    </View>
  );
};

export default ShoutoutButton;

const styles = StyleSheet.create({
  icon: {alignItems: 'center'},
});
