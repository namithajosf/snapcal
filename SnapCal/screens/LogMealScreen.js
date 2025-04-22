import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogMealScreen({ route, navigation }) {
  const { imageUri, analyzedData } = route.params || {};

  const [title, setTitle] = useState(analyzedData?.foodName || "Unknown Food");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [calories, setCalories] = useState(analyzedData?.calories?.toString() || "0");
  const [fat, setFat] = useState(analyzedData?.fat?.toString() || "0");
  const [protein, setProtein] = useState(analyzedData?.protein?.toString() || "0");
  const [carbs, setCarbs] = useState(analyzedData?.carbs?.toString() || "0");

  const toggleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  const handleSaveMeal = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }
  
      const userData = JSON.parse(userDataString);
      const userId = userData?.id;
  
      if (!userId) {
        console.log("Parsed userData:", userData);
        console.log("Extracted userId:", userId);
        Alert.alert("Error", "User ID missing. Please log in again.");
        return;
      }
  
      const payload = {
        user_id: parseInt(userId),
        title: title,
        calories: parseInt(calories),
        fat: parseInt(fat),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
      };
  
      await axios.post('http://192.168.141.84:8000/log-meal', payload);
      Alert.alert("Success", "Meal logged successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to log meal.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Header leftComponent={<Text style={styles.headerLeftText}>Log Meal</Text>} navigation={navigation} />

        <Image
          style={styles.image}
          source={imageUri ? { uri: imageUri } : require('../assets/placeholder.png')}
        />

        {/* Editable Title */}
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            {isEditingTitle ? (
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={toggleEditTitle}
                returnKeyType="done"
                multiline
                autoFocus
              />
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
            <TouchableOpacity style={styles.editTitleIcon} onPress={toggleEditTitle}>
              <MaterialCommunityIcons
                name={isEditingTitle ? 'check' : 'pencil'}
                size={20}
                color="#72C95A"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subHeading}>Meal Details</Text>

        <View style={styles.mealInfoWrapper}>
          <MealInfo label="Calories (kcal)" value={calories} setValue={setCalories} />
          <MealInfo label="Fat (g)" value={fat} setValue={setFat} />
          <MealInfo label="Protein (g)" value={protein} setValue={setProtein} />
          <MealInfo label="Carbs (g)" value={carbs} setValue={setCarbs} />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleSaveMeal}>
          <Text style={styles.confirmText}>Confirm and Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

function MealInfo({ label, value, setValue }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.label}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              onSubmitEditing={toggleEdit}
              returnKeyType="done"
              autoFocus
            />
          ) : (
            <Text style={styles.value}>{value}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editBubble} onPress={toggleEdit}>
          <MaterialCommunityIcons name={isEditing ? 'check' : 'pencil'} size={16} color="#72C95A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#000000',
    flex: 1,
  },
  titleContainer: {
    marginBottom: 20,
    alignSelf: 'center',
    maxWidth: '96%',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleInput: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 4,
    flex: 1,
    minHeight: 30,
  },
  editTitleIcon: {
    backgroundColor: '#E6F4EA',
    borderRadius: 20,
    padding: 6,
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000000',
  },
  mealInfoWrapper: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#204201',
  },
  value: {
    color: '#555',
  },
  input: {
    color: '#555',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 2,
    fontSize: 16,
    width: 100,
  },
  editBubble: {
    backgroundColor: '#E6F4EA',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#216a35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerLeftText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
  },
});
