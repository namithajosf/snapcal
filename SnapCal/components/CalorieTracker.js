import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNutrition } from '../contexts/NutritionContext';
import NutrientBar from './NutrientBar';

export default function CalorieTracker() {
  const { consumedCalories, dailyGoal, macros } = useNutrition();
  
  // Circle progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 10;
  const strokeDashoffset = circumference - (consumedCalories / dailyGoal) * circumference;

  return (
    <View style={styles.calorieTracker}>
      {/* Circular Progress Bar (Left) */}
      <View style={styles.calorieCircle}>
        <Svg width="150" height="150" viewBox="0 0 150 150">
          <Circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#2F855A"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.calorieText}>{consumedCalories} / {dailyGoal} kcal</Text>
      </View>

      {/* Nutrient Info (Right) */}
      <View style={styles.nutrientInfo}>
        <NutrientBar 
          label="Fat" 
          consumed={macros.fat.consumed} 
          goal={macros.fat.goal} 
          color="#F6E05E" 
        />
        <NutrientBar 
          label="Protein" 
          consumed={macros.protein.consumed} 
          goal={macros.protein.goal} 
          color="#68D391" 
        />
        <NutrientBar 
          label="Carbs" 
          consumed={macros.carbs.consumed} 
          goal={macros.carbs.goal} 
          color="#F6AD55" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calorieTracker: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  calorieCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  calorieText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  nutrientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
});
