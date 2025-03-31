import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MealItem from './MealItem';

export default function MealsList({ navigation }) {
  // Meals dictionary
  const meals = [
    { type: 'Breakfast', recommended: 336, icon: require('../assets/breakfast.png') },
    { type: 'Lunch', recommended: 403, icon: require('../assets/lunch.png') },
    { type: 'Dinner', recommended: 403, icon: require('../assets/dinner.png') },
    { type: 'Snacks', recommended: 201, icon: require('../assets/snack.png') },
  ];

  return (
    <View style={styles.mealsSection}>
      <Text style={styles.sectionTitle}>Log your meals</Text>
      {meals.map((meal, index) => (
        <MealItem 
          key={index} 
          meal={meal} 
          onPress={() => navigation.navigate('AddMeal', { mealType: meal.type })} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 16,
  },
});
