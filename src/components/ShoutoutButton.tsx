import React, {useContext, useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import AuthUserContext from '../contexts/AuthUser';
import DefaultText from '../defaults/DefaultText';
import {addShoutout, removeShoutout} from '../functions/Content';
import {TStyleView} from '../types/style';

type TProps = {collection: string; id: string; style?: TStyleView};

const ShoutoutButton = ({collection, id, style}: TProps) => {
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
    <View style={style}>
      {isShoutouted && (
        <DefaultText title="Shoutouted" onPress={onUnshoutout} />
      )}
      {!isShoutouted && <DefaultText title="Shoutout" onPress={onShoutout} />}
    </View>
  );
};

export default ShoutoutButton;
