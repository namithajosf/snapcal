// MealsList.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MealItem from './MealItem';

export default function MealsList({ navigation, meals, loading }) {
  const mealTypes = [
    { type: 'Breakfast', icon: require('../assets/breakfast.png') },
    { type: 'Lunch', icon: require('../assets/lunch.png') },
    { type: 'Dinner', icon: require('../assets/dinner.png') },
    { type: 'Other', icon: require('../assets/other.png') },
  ];

  return (
    <View style={styles.mealsSection}>
      <Text style={styles.sectionTitle}>Log your meals</Text>
      {mealTypes.map((mealType, index) => {
        const filteredMeals = meals.filter(
          (meal) => meal.meal_type === mealType.type
        );

        return (
          <MealItem
            key={index}
            meal={mealType}
            onPress={() => navigation.navigate('AddMeal', { mealType: mealType.type })}
            loggedMeals={filteredMeals}
            loading={loading}
            navigation={navigation}
          />
        );
      })}
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
