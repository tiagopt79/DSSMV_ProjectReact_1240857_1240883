import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const AddBookModal = ({ visible, onClose, onSearchPress, onScanPress }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Adicionar um livro</Text>
              
              <TouchableOpacity style={styles.optionButton} onPress={onSearchPress}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🔍</Text>
                </View>
                <Text style={styles.optionText}>Por pesquisa</Text>
              </TouchableOpacity>

              <View style={styles.separator} />

              <TouchableOpacity style={styles.optionButton} onPress={onScanPress}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📷</Text>
                </View>
                <Text style={styles.optionText}>Por código de barras</Text>
              </TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 22,
    color: '#666',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
    marginLeft: 55,
  }
});

export default AddBookModal;