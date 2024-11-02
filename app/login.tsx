import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { Link } from 'expo-router';

const Login = ({navigation}: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email,
          password,
        });
        console.log(response.data);  // Check if the token is present
        if (response.data.success) {
          Alert.alert('Login Successful');
          navigation.navigate('Main');
        } else {
          Alert.alert('Login Failed', response.data.message);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Could not log in.');
      }
    };
    


    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
          <Button title="Login" onPress={handleLogin} color="#6200EE" />
        </View>
        <View>
          <Text>New to the app? <Link style={styles.link} href={'/signup'}>Sign Up</Link></Text>
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

export default Login;
