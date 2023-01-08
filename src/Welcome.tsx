import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DefaultText from './DefaultText';
import SignIn from './SignIn';

const Welcome = () => {
  const [modal, setModal] = useState<'enter'>();
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <DefaultText
          title="Shoutout"
          textStyle={{fontSize: 50, fontWeight: 'bold'}}
        />

        <DefaultText
          title="No follower, views, Only Contents"
          style={{fontSize: 20}}
        />

        <View style={{marginTop: 30}}>
          <DefaultText title="1. Only one content per day" />
          <DefaultText title="2. Get and send shoutouts to only the best contents" />
          <DefaultText title="3. Check daily, weekly, monthly, yearly rankings" />
        </View>
      </View>
      <DefaultText
        title="Enter"
        onPress={() => setModal('enter')}
        style={{
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'white',
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      />

      {modal === 'enter' && <SignIn onCancel={() => setModal(undefined)} />}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
