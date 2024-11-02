import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyButton from '../components/MyButton';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();
  const onContinue = () => {
    router.navigate("/main")
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SecureVault</Text>
      <Text style={styles.subtitle}>Your personal password manager</Text>
      <MyButton title={"Continue"} onPress={onContinue} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30
  }
});

export default Index;
