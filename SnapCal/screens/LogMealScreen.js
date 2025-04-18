import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LogMealScreen({ route, navigation }) {
  const { imageUri } = route.params || {}; // 👈 Get the image from route params

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color="#3D3D3D" />
      </TouchableOpacity>

      <Image
        style={styles.image}
        source={imageUri ? { uri: imageUri } : require('../assets/placeholder.png')} // fallback
      />

      {/* Meal Title */}
      <Text style={styles.title}>Chicken, Mashed Potatoes and Green Beans</Text>

      {/* Meal Details */}
      <Text style={styles.subHeading}>Meal Details</Text>

      <View style={styles.card}>
        <MealInfo label="Calories" value="435 kcal approx." />
        <MealInfo label="Fat" value="29g" />
        <MealInfo label="Protein" value="87g approx." />
        <MealInfo label="Carbs" value="50g approx." />
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm and Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MealInfo({ label, value }) {
  return (
    <View style={styles.mealInfo}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="pencil" size={20} color="#72C95A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  mealInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#3D3D3D',
  },
  value: {
    color: '#555',
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
});
