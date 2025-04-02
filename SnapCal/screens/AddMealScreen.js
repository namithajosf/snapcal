import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useNutrition } from '../contexts/NutritionContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function AddMealScreen({ route, navigation }) {
  const { mealType } = route.params;
  const { setConsumedCalories, consumedCalories, macros, setMacros } = useNutrition();
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleAddMeal = () => {
    const calNum = parseInt(calories) || 0;
    const proteinNum = parseInt(protein) || 0;
    const carbsNum = parseInt(carbs) || 0;
    const fatNum = parseInt(fat) || 0;
    
    setConsumedCalories(consumedCalories + calNum);
    
    setMacros({
      protein: { consumed: macros.protein.consumed + proteinNum, goal: macros.protein.goal },
      carbs: { consumed: macros.carbs.consumed + carbsNum, goal: macros.carbs.goal },
      fat: { consumed: macros.fat.consumed + fatNum, goal: macros.fat.goal }
    });
    
    navigation.goBack();
  };

  const openCamera = () => {
    const options = { mediaType: 'photo', cameraType: 'back', saveToPhotos: true };
    launchCamera(options, (response) => {
      if (!response.didCancel && !response.error) {
        console.log('Camera Image:', response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    const options = { mediaType: 'photo' };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.error) {
        console.log('Gallery Image:', response.assets[0].uri);
      }
    });
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
            <TextInput style={styles.input} value={foodName} onChangeText={setFoodName} placeholder="Enter food name" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholder="Enter calories" />
          </View>
          <View style={styles.macrosContainer}>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput style={styles.input} value={protein} onChangeText={setProtein} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput style={styles.input} value={carbs} onChangeText={setCarbs} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput style={styles.input} value={fat} onChangeText={setFat} keyboardType="numeric" placeholder="0" />
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
