import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNutrition } from '../contexts/NutritionContext';

export default function OtherDrinks() {
  const { drinks, incrementDrinkCount, decrementDrinkCount } = useNutrition();

  return (
    <View style={styles.otherDrinksContainer}>
      <View style={styles.otherDrinksHeader}>
        <Text style={styles.otherDrinksTitle}>Other</Text>
        <FontAwesome name="plus-circle" size={24} color="#2F855A" />
      </View>
      {Object.keys(drinks).map((drinkKey, index) => (
        <View key={index} style={styles.otherDrinkItem}>
          <Text style={styles.otherDrinkText}>
            {drinkKey.charAt(0).toUpperCase() + drinkKey.slice(1)} - {drinks[drinkKey].count}
          </Text>
          <View style={styles.drinkButtons}>
            <TouchableOpacity onPress={() => decrementDrinkCount(drinkKey)}>
              <FontAwesome name="minus-circle" size={16} color="#2F855A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => incrementDrinkCount(drinkKey)}>
              <FontAwesome name="plus-circle" size={16} color="#2F855A" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  otherDrinksContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  otherDrinksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  otherDrinksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  otherDrinkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  otherDrinkText: {
    fontSize: 14,
    flex: 1,
  },
  drinkButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
