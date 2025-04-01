import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNutrition } from '../contexts/NutritionContext';

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
    
    // Update consumed calories
    setConsumedCalories(consumedCalories + calNum);
    
    // Update macros
    setMacros({
      protein: {
        consumed: macros.protein.consumed + proteinNum,
        goal: macros.protein.goal
      },
      carbs: {
        consumed: macros.carbs.consumed + carbsNum,
        goal: macros.carbs.goal
      },
      fat: {
        consumed: macros.fat.consumed + fatNum,
        goal: macros.fat.goal
      }
    });
    
    // Navigate back to home
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add {mealType}</Text>
        
        <View style={styles.addOptions}>
          <TouchableOpacity style={styles.optionCard}>
            <FontAwesome name="camera" size={24} color="#2F855A" />
            <Text style={styles.optionText}>Take a Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionCard}>
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
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMeal}
        >
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 24,
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
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
