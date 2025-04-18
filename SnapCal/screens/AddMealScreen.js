import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useNutrition } from '../contexts/NutritionContext';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

export default function AddMealScreen({ route, navigation }) {
  const { mealType } = route.params || {};
  const { analyzedData } = route.params || {};
  const { setConsumedCalories, consumedCalories, macros, setMacros } = useNutrition();
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [cameraPermission, setCameraPermission] = useState(null);
  const [libraryPermission, setLibraryPermission] = useState(null);

  // Apply analyzed data if available
  useFocusEffect(
    React.useCallback(() => {
      if (analyzedData) {
        setFoodName(analyzedData.foodName || '');
        setCalories(analyzedData.calories || '');
        setProtein(analyzedData.protein || '');
        setCarbs(analyzedData.carbs || '');
        setFat(analyzedData.fat || '');
      }
    }, [analyzedData])
  );

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      setCameraPermission(cameraStatus.status === 'granted');
      setLibraryPermission(libraryStatus.status === 'granted');
    })();
  }, []);

  const handleAddMeal = () => {
    if (!foodName || !calories || !protein || !carbs || !fat) {
      Alert.alert(
        'Missing Information',
        'Please fill in all the fields before adding the meal.'
      );
      return;
    }
  
    const calNum = parseInt(calories) || 0;
    const proteinNum = parseInt(protein) || 0;
    const carbsNum = parseInt(carbs) || 0;
    const fatNum = parseInt(fat) || 0;
  
    setConsumedCalories(consumedCalories + calNum);
  
    setMacros({
      protein: { consumed: macros.protein.consumed + proteinNum, goal: macros.protein.goal },
      carbs: { consumed: macros.carbs.consumed + carbsNum, goal: macros.carbs.goal },
      fat: { consumed: macros.fat.consumed + fatNum, goal: macros.fat.goal },
    });
  
    navigation.goBack();
  };
  

  const openCamera = async () => {
    if (!cameraPermission) {
      Alert.alert(
        'Camera Permission Denied',
        'We need camera access to take photos.',
        [
          { text: 'OK' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        console.log('Camera Image URI:', result.assets[0].uri);
        navigation.navigate('PreviewScreen', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.log('Error launching camera:', error);
    }
  };

  const openGallery = async () => {
    if (!libraryPermission) {
      Alert.alert(
        'Photo Library Permission Denied',
        'We need access to your photo library to upload images.',
        [
          { text: 'OK' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        console.log('Gallery Image URI:', result.assets[0].uri);
        navigation.navigate('PreviewScreen', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.log('Error opening gallery:', error);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header leftComponent={<Text style={styles.headerLeftText}>Add {mealType}</Text>} navigation={navigation} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.addOptions}>
            <TouchableOpacity style={styles.optionCard} onPress={openCamera}>
              <FontAwesome name="camera" size={24} color="#2F855A" />
              <Text style={styles.optionText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard} onPress={openGallery}>
              <FontAwesome name="image" size={24} color="#2F855A" />
              <Text style={styles.optionText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Manual Entry</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={styles.input}
              value={foodName}
              onChangeText={setFoodName}
              placeholder="Enter food name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholder="Enter calories"
            />
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
            <Text style={styles.addButtonText}>Add Meal</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerLeftText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  addOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  optionText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    color: '#4A5568',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  macroInput: {
    width: '30%',
  },
  addButton: {
    backgroundColor: '#2F855A',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});