import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView
} from 'react-native';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export default function PreviewScreen({ route, navigation }) {
  const { imageUri } = route.params || {};
  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

const analyzeImage = async () => {
  try {
    console.log("Sending image for analysis...");

    const fileUri = imageUri;
    const fileType = fileUri.split('.').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const response = await axios.post(
      'http://192.168.141.84:8000/predict-meal',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const { foodName, calories, protein, carbs, fat } = response.data;

    navigation.replace('LogMeal', {
      imageUri,
      analyzedData: {
        foodName,
        calories,
        protein,
        carbs,
        fat,
      }
    });
    console.log("Image analysis response:", response.data);
  } catch (error) {
    console.error('Image analysis failed:', error);
    alert('Failed to analyze the image. Please try again.');
  }
};

  

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <BlurView intensity={100} tint="dark" style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Capture</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No image selected</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={analyzeImage}
            >
              <Text style={styles.analyzeButtonText}>Send for Analysis</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exitButton}
              onPress={closeModal}
            >
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#4A5568',
  },
  imageContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  foodImage: {
    width: '100%',
    height: 350,
  },
  noImageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noImageText: {
    color: '#4A5568',
    fontSize: 16,
  },
  analyzeButton: {
    width: '100%',
    backgroundColor: '#2F855A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  exitButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: 'bold',
  },
});