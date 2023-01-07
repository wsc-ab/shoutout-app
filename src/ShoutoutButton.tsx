import React, {useContext, useEffect, useState} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import AuthUserContext from './AuthUser';
import {addShoutout, removeShoutout} from './functions/content';

type TProps = {collection: string; id: string};

const ShoutoutButton = ({collection, id}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const onShoutout = async () => {
    try {
      setIsShoutouted(true);
      await addShoutout({content: {id}});
    } catch (error) {
      setIsShoutouted(false);
      Alert.alert('Please retry', 'Failed to shoutout');
    }
  };

  const onUnshoutout = async () => {
    try {
      setIsShoutouted(false);
      await removeShoutout({
        content: {id},
      });
    } catch (error) {
      setIsShoutouted(false);
      Alert.alert('Please retry', 'Failed to unshoutout');
    }
  };

  const [isShoutouted, setIsShoutouted] = useState(false);

  useEffect(() => {
    setIsShoutouted(authUserData.shoutoutTo?.[collection]?.ids.includes(id));
  }, [authUserData.shoutoutTo, collection, id]);

  return (
    <View>
      {isShoutouted && (
        <Pressable onPress={onUnshoutout}>
          <Text>Shoutouted</Text>
        </Pressable>
      )}
      {!isShoutouted && (
        <Pressable onPress={onShoutout}>
          <Text>Shoutout</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ShoutoutButton;
