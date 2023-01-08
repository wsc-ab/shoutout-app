import React, {useContext, useEffect, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import AuthUserContext from '../contexts/AuthUser';
import DefaultText from '../defaults/DefaultText';
import {addShoutout, removeShoutout} from '../functions/Content';

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
        <DefaultText title="Shoutouted" onPress={onUnshoutout} />
      )}
      {!isShoutouted && <DefaultText title="Shoutout" onPress={onShoutout} />}
    </View>
  );
};

export default ShoutoutButton;
