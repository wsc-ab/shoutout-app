import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function PhoneSignIn() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>();

  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  async function confirmCode() {
    if (!confirm) {
      return;
    }

    try {
      setIsSubmitting(true);
      await confirm.confirm(code);
    } catch (error) {
      Alert.alert('Please retry', 'Invalid code');
    } finally {
      setIsSubmitting(false);
    }
  }

  const signInWithPhoneNumber = async () => {
    setIsSubmitting(true);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    setIsSubmitting(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 50, fontWeight: 'bold'}}>Shoutout</Text>
        <Text style={{fontSize: 20}}>No followers or views, Only contents</Text>
        <View style={{marginTop: 30}}>
          <Text>1. Only one content per day</Text>
          <Text style={{marginTop: 10}}>
            2. Get and send shoutouts to only the best contents
          </Text>
          <Text style={{marginTop: 10}}>
            3. Check daily, weekly, monthly, yearly rankings
          </Text>
        </View>
      </View>

      {!confirm && (
        <>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.textInput}
            placeholder="Phone number"
          />
          <View style={{flexDirection: 'row'}}>
            {!isSubmitting && (
              <Button title="Enter" onPress={signInWithPhoneNumber} />
            )}
            {isSubmitting && <ActivityIndicator />}
          </View>
        </>
      )}
      {confirm && (
        <>
          <TextInput
            value={code}
            onChangeText={setCode}
            style={styles.textInput}
            placeholder="Enter the code sent to your phone"
          />
          <View style={{flexDirection: 'row'}}>
            {!isSubmitting && (
              <>
                <Button title="Enter" onPress={() => confirmCode()} />
                <Button title="Cancel" onPress={() => setConfirm(undefined)} />
              </>
            )}
            {isSubmitting && <ActivityIndicator />}
          </View>
        </>
      )}
    </KeyboardAwareScrollView>
  );
}

export default PhoneSignIn;

const styles = StyleSheet.create({
  textInput: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
});
