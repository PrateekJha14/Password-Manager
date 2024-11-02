import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
} from 'react-native';
import { checkPasswordStrength } from '../utils/passwordStrengthChecker';

interface PasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPassword: (password: string) => void;
  manualPassword: string;
  setManualPassword: (password: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  visible,
  onClose,
  onAddPassword,
  manualPassword,
  setManualPassword,
}) => {
  const [passwordStrength, setPasswordStrength] = React.useState<|'weak' | 'good' | 'strong' | 'veryStrong'>('');

  const handleAddPassword = () => {
    if (manualPassword.trim()) {
      onAddPassword(manualPassword);
      setManualPassword('');
      setPasswordStrength(checkPasswordStrength(manualPassword));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add Manual Password</Text>
        <TextInput
          style={[styles.input, passwordStrength === 'weak' && styles.weakInput]}
          placeholder="Enter your password"
          value={manualPassword}
          onChangeText={(text) => {
            setManualPassword(text);
            setPasswordStrength(checkPasswordStrength(text));
          }}
        />
        <Text style={styles.strengthIndicator}>{passwordStrength}</Text>
        <Button title="Add" onPress={handleAddPassword} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  weakInput: {
    borderColor: 'red',
  },
  strengthIndicator: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
});

export default PasswordModal;
