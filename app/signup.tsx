import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { Link } from 'expo-router';

const Signup = ({navigation}: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const response = await axios.post('http://localhost:3000/signup', {
            email,
            password: hashedPassword,
          });
          if (response.data.success) {
            Alert.alert('Signup Successful');
            navigation.navigate('Login');
          } else {
            Alert.alert('Signup Failed', response.data.message);
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Could not sign up.');
        }
      };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} color="#6200EE" />
        </View>
        <View>
          <Text>Already have an account? <Link style={styles.link} href={'/login'}>Login</Link></Text>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#F3F4F6',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 24,
    },
    input: {
      height: 50,
      borderColor: '#6200EE',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: '#fff',
    },
    buttonContainer: {
      marginTop: 20,
    },
    link: {
      color: "blue",
    }
  });

export default Signup;
