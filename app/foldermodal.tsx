// FolderModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const FolderModal = ({ visible, onClose, onCreate }: { visible: boolean; onClose: () => void; onCreate: (name: string) => void; }) => {
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    if (folderName) {
      onCreate(folderName);
      setFolderName('');
      onClose();
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Folder</Text>
          <TextInput
            placeholder="Enter folder name"
            value={folderName}
            onChangeText={setFolderName}
            style={styles.input}
          />
          <Button title="Create" onPress={handleCreate} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default FolderModal;
