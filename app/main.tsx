import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import FolderModal from './foldermodal';
import PasswordModal from './passwordmodal';


interface Folder {
  name: string;
  passwords: string[];
}

const STORAGE_KEY = '@password_manager_folders';

const MainScreen = ({ navigation }: any) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [generatePasswordModalVisible, setGeneratePasswordModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [manualPassword, setManualPassword] = useState('');

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const storedFolders = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedFolders) {
          setFolders(JSON.parse(storedFolders));
        }
      } catch (error) {
        console.error('Failed to load folders:', error);
      }
    };
    loadFolders();
  }, []);

  useEffect(() => {
    const saveFolders = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
      } catch (error) {
        console.error('Failed to save folders:', error);
      }
    };
    saveFolders();
  }, [folders]);

  const createFolder = (folderName: string) => {
    const newFolder = { name: folderName, passwords: [] };
    setFolders([...folders, newFolder]);
    setFolderModalVisible(false);
  };

  const addPasswordToFolder = (password: string) => {
    if (selectedFolder) {
      const updatedFolders = folders.map(folder =>
        folder.name === selectedFolder.name
          ? { ...folder, passwords: [...folder.passwords, password] }
          : folder
      );
      setFolders(updatedFolders);
      setPasswordModalVisible(false);
      setManualPassword(''); // Clear input after adding
    }
  };

  const openPasswordModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setPasswordModalVisible(true);
  };

  const copyToClipboard = (password: string) => {
    Clipboard.setString(password);
    Alert.alert('Copied to Clipboard', password);
  };

  const generatePassword = () => {
    let characters = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) characters += '0123456789';
    if (includeSpecial) characters += '!@#$%^&*()_+[]{}|;:,.<>?';

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    if (selectedFolder) {
      addPasswordToFolder(password);
    }
    setGeneratePasswordModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Folders</Text>
      {!selectedFolder ? (
        <>
          <FlatList
            data={folders}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.folderItem} onPress={() => setSelectedFolder(item)}>
                <Text style={styles.folderText}>{item.name}</Text>
                <Text style={styles.passwordCount}>{item.passwords.length} Passwords</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No folders created yet.</Text>}
          />
          <TouchableOpacity style={styles.fab} onPress={() => setFolderModalVisible(true)}>
            <FontAwesome name="plus" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView style={styles.passwordContainer}>
          <TouchableOpacity
            onPress={() => setSelectedFolder(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>⬅️ Back to Folders</Text>
          </TouchableOpacity>
          <Text style={styles.passwordTitle}>{selectedFolder.name} Passwords</Text>
          <FlatList
            data={selectedFolder.passwords}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.passwordItemContainer}>
                <Text style={styles.passwordText}>{item}</Text>
                <TouchableOpacity onPress={() => copyToClipboard(item)} style={styles.copyButton}>
                  <FontAwesome name="clipboard" size={20} color="#6200EE" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No passwords available.</Text>}
          />
          <TouchableOpacity onPress={() => setGeneratePasswordModalVisible(true)} style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Generate Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPasswordModal(selectedFolder)} style={styles.addPasswordButton}>
            <Text style={styles.addPasswordButtonText}>Add Manual Password</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <FolderModal
        visible={folderModalVisible}
        onClose={() => setFolderModalVisible(false)}
        onCreate={createFolder}
      />

      <PasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onAddPassword={addPasswordToFolder}
        manualPassword={manualPassword}
        setManualPassword={setManualPassword}
      />

      <Modal
        visible={generatePasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGeneratePasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Generate Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password Length"
            keyboardType="numeric"
            value={passwordLength.toString()}
            onChangeText={(text) => setPasswordLength(Number(text))}
          />
          <View style={styles.checkboxContainer}>
            <Text>Include Uppercase</Text>
            <Switch
              value={includeUppercase}
              onValueChange={setIncludeUppercase}
            />
            <Text>Include Numbers</Text>
            <Switch
              value={includeNumbers}
              onValueChange={setIncludeNumbers}
            />
            <Text>Include Special Characters</Text>
            <Switch
              value={includeSpecial}
              onValueChange={setIncludeSpecial}
            />
          </View>
          <Button title="Generate" onPress={generatePassword} />
          <Button title="Cancel" onPress={() => setGeneratePasswordModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a4e69',
    marginBottom: 15,
    textAlign: 'center',
  },
  folderItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  folderText: {
    fontSize: 20,
    color: '#333',
  },
  passwordCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6c757d',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4a4e69',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  passwordContainer: {
    marginTop: 20,
    padding: 10,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1b1d28',
  },
  passwordTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4e69',
    marginBottom: 10,
  },
  passwordItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 4,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  passwordText: {
    fontSize: 18,
    color: '#333',
  },
  copyButton: {
    paddingHorizontal: 8,
  },
  generateButton: {
    backgroundColor: '#4a4e69',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  addPasswordButton: {
    backgroundColor: '#4a4e69',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPasswordButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4e69',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default MainScreen;
