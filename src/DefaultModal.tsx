import React, {ReactNode} from 'react';
import {Button, Modal, Text, View} from 'react-native';

type TProps = {
  title: string;
  left: {title: string; onPress: () => void};
  right?: {title: string; onPress: () => void};
  children: ReactNode;
};

const DefaultModal = ({title, left, children, right}: TProps) => {
  return (
    <Modal presentationStyle="pageSheet" animationType="slide">
      <View style={{padding: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <Button title={left.title} onPress={left.onPress} />
          </View>
          <Text
            style={{
              fontSize: 20,
              flex: 1,
              textAlign: 'center',
            }}>
            {title}
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            {right && <Button title={right.title} onPress={right.onPress} />}
          </View>
        </View>
        {children}
      </View>
    </Modal>
  );
};

export default DefaultModal;
