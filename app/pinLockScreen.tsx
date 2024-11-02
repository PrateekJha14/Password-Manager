import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const PinLockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  useEffect(() => {
    (async () => {
      const savedPin = await getPin();
      const savedEmail = await getRecoveryEmail();
      if (savedPin) {
        setStoredPin(savedPin);
      } else {
        setIsSettingPin(true);
      }
      if (savedEmail) {
        setRecoveryEmail(savedEmail);
      }
    })();
  }, []);

  const getPin = async () => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('userPin');
    } else {
      return await SecureStore.getItemAsync('userPin');
    }
  };

  const getRecoveryEmail = async () => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('recoveryEmail');
    } else {
      return await SecureStore.getItemAsync('recoveryEmail');
    }
  };

  const savePin = async (pin: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('userPin', pin);
    } else {
      await SecureStore.setItemAsync('userPin', pin);
    }
  };

  const saveRecoveryEmail = async (email: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('recoveryEmail', email);
    } else {
      await SecureStore.setItemAsync('recoveryEmail', email);
    }
  };

  const handlePinSubmit = async () => {
    if (isSettingPin) {
      await savePin(pin);
      await saveRecoveryEmail(recoveryEmail);
      setStoredPin(pin);
      setIsSettingPin(false);
      Alert.alert('PIN Set Successfully');
      onUnlock();
    } else if (pin === storedPin) {
      onUnlock();
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
    }
    setPin('');
  };

  const handleRecovery = () => {
    console.log('Recover PIN button pressed');
    if (recoveryEmail) {
        
      Alert.alert('Recovery Email', `Your recovery email is: ${recoveryEmail}`);
      // You can implement further functionality here, like sending an email for PIN reset
    } else {
      Alert.alert('Error', 'Please set a recovery email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSettingPin ? 'Set a 4-digit PIN' : 'Enter your PIN'}
      </Text>
      <TextInput
        style={styles.pinInput}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />
      {isSettingPin && (
        <>
          <TextInput
            style={styles.emailInput}
            value={recoveryEmail}
            onChangeText={setRecoveryEmail}
            placeholder="Enter Recovery Email"
            keyboardType="email-address"
          />
        </>
      )}
      <Button title="Submit" onPress={handlePinSubmit} disabled={pin.length !== 4} />
      <Button title="Recover PIN" onPress={handleRecovery} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  pinInput: {
    fontSize: 24,
    borderBottomWidth: 1,
    width: '50%',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    width: '80%',
    textAlign: 'left',
    marginBottom: 20,
  },
});

export default PinLockScreen;
