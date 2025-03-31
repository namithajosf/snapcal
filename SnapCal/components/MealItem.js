import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function MealItem({ meal, onPress }) {
  return (
    <TouchableOpacity style={styles.mealItem} onPress={onPress}>
      <View style={styles.mealInfo}>
        <Image source={meal.icon} style={styles.mealIcon} />
        <View>
          <Text style={styles.mealTitle}>{meal.type}</Text>
          <Text style={styles.mealSubText}>Recommended: {meal.recommended} kcal</Text>
        </View>
      </View>
      <FontAwesome name="plus-circle" size={24} color="#2F855A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
    borderRadius: 16,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealSubText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});
