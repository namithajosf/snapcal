import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNutrition } from '../contexts/NutritionContext';

export default function WaterTracker() {
  const { 
    waterCount, 
    waterAmount, 
    incrementWaterCount, 
    decrementWaterCount 
  } = useNutrition();

  return (
    <View style={styles.waterContainer}>
      <FontAwesome name="tint" size={64} color="#4299E1" style={styles.waterIcon} />
      <View style={styles.waterInfo}>
        <TouchableOpacity onPress={decrementWaterCount}>
          <FontAwesome name="minus-circle" size={24} color="#4299E1" />
        </TouchableOpacity>
        <Text style={styles.waterText}>{waterCount}/8</Text>
        <TouchableOpacity onPress={incrementWaterCount}>
          <FontAwesome name="plus-circle" size={24} color="#4299E1" />
        </TouchableOpacity>
      </View>
      <Text style={styles.waterSubText}>{waterAmount} ml</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  waterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
    marginRight: 8,
  },
  waterIcon: {
    marginBottom: 8,
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  waterSubText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});
