import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const [consumedCalories, setConsumedCalories] = useState(600);
  const [dailyGoal, setDailyGoal] = useState(1346);
  const [macros, setMacros] = useState({
    fat: { consumed: 20, goal: 44 },
    protein: { consumed: 40, goal: 67 },
    carbs: { consumed: 100, goal: 168 },
  });
  const [waterCount, setWaterCount] = useState(0); // Start water count at 0
  const [waterAmount, setWaterAmount] = useState(0); // Start water amount at 0 ml

  // Drinks object
  const [drinks, setDrinks] = useState({
    coffee: { count: 3 },
    tea: { count: 2 },
    coke: { count: 5 },
    milkshake: { count: 1 },
  });

  // Circle progress calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 10;
  const strokeDashoffset = circumference - (consumedCalories / dailyGoal) * circumference;

  // Meals dictionary
  const meals = [
    { type: 'Breakfast', recommended: 336, icon: require('../assets/breakfast.png') },
    { type: 'Lunch', recommended: 403, icon: require('../assets/lunch.png') },
    { type: 'Dinner', recommended: 403, icon: require('../assets/dinner.png') },
    { type: 'Snacks', recommended: 201, icon: require('../assets/snack.png') },
  ];

  // Function to increment drink count
  const incrementDrinkCount = (drinkKey) => {
    setDrinks({
      ...drinks,
      [drinkKey]: { count: drinks[drinkKey].count + 1 },
    });
  };

  // Function to decrement drink count
  const decrementDrinkCount = (drinkKey) => {
    if (drinks[drinkKey].count > 0) {
      setDrinks({
        ...drinks,
        [drinkKey]: { count: drinks[drinkKey].count - 1 },
      });
    }
  };

  // Function to increment water count and update water amount
  const incrementWaterCount = () => {
    setWaterCount(waterCount + 1);
    setWaterAmount(waterAmount + 150); // Increase water amount by 150 ml
  };

  // Function to decrement water count and update water amount
  const decrementWaterCount = () => {
    if (waterCount > 0) {
      setWaterCount(waterCount - 1);
      setWaterAmount(waterAmount - 150); // Decrease water amount by 150 ml
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>SnapCal</Text>
          <FontAwesome name="user-circle" size={24} color="#2F855A" />
        </View>

        {/* Calorie Tracker */}
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
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Fat</Text>
              <View style={styles.nutrientBarContainer}>
                <View
                  style={[
                    styles.nutrientBar,
                    { width: `${(macros.fat.consumed / macros.fat.goal) * 100}%`, backgroundColor: '#F6E05E' },
                  ]}
                />
              </View>
              <Text style={styles.nutrientValue}>{macros.fat.consumed}/{macros.fat.goal}g</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Protein</Text>
              <View style={styles.nutrientBarContainer}>
                <View
                  style={[
                    styles.nutrientBar,
                    { width: `${(macros.protein.consumed / macros.protein.goal) * 100}%`, backgroundColor: '#68D391' },
                  ]}
                />
              </View>
              <Text style={styles.nutrientValue}>{macros.protein.consumed}/{macros.protein.goal}g</Text>
            </View>
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Carbs</Text>
              <View style={styles.nutrientBarContainer}>
                <View
                  style={[
                    styles.nutrientBar,
                    { width: `${(macros.carbs.consumed / macros.carbs.goal) * 100}%`, backgroundColor: '#F6AD55' },
                  ]}
                />
              </View>
              <Text style={styles.nutrientValue}>{macros.carbs.consumed}/{macros.carbs.goal}g</Text>
            </View>
          </View>
        </View>

        {/* Log your meals */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Log your meals</Text>
          {meals.map((meal, index) => (
            <TouchableOpacity key={index} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Image source={meal.icon} style={styles.mealIcon} />
                <View>
                  <Text style={styles.mealTitle}>{meal.type}</Text>
                  <Text style={styles.mealSubText}>Recommended: {meal.recommended} kcal</Text>
                </View>
              </View>
              <FontAwesome name="plus-circle" size={24} color="#2F855A" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Drinks */}
        <View style={styles.drinksSection}>
          <Text style={styles.sectionTitle}>Drinks</Text>
          <View style={styles.drinksContainer}>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
  },
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
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    marginRight: 8,
  },
  nutrientBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginRight: 8,
  },
  nutrientBar: {
    height: 8,
    borderRadius: 4,
  },
  nutrientValue: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 16,
  },
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
  drinksSection: {
    marginBottom: 24,
  },
  drinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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