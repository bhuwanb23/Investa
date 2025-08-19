import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  stockSymbol: string;
  quantity: number;
  isBuyMode: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  stockSymbol,
  quantity,
  isBuyMode,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.successAnimation}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.message}>
            Your {isBuyMode ? 'buy' : 'sell'} order for {quantity} share{quantity > 1 ? 's' : ''} of {stockSymbol} has been submitted successfully.
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue Trading</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    alignItems: 'center',
    maxWidth: 320,
  },
  successAnimation: {
    marginBottom: 16,
  },
  successIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#10B981',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default SuccessModal;
