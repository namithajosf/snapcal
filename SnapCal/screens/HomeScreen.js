import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CalorieTracker from '../components/CalorieTracker';
import MealsList from '../components/MealsList';
import DrinksSection from '../components/DrinksSection';
import { FontAwesome } from '@expo/vector-icons';
import { useNutrition } from '../contexts/NutritionContext';

export default function HomeScreen({ navigation }) {
  const { meals } = useNutrition();

  return (
    <>
      <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          leftComponent={<Text style={styles.headerText}>SnapCal</Text>}
          rightComponent={
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <FontAwesome name="user-circle" size={24} color="#2F855A" />
            </TouchableOpacity>
          }
        />

        <ScrollView style={styles.scrollView}>
          <CalorieTracker />
          <MealsList navigation={navigation} />
          <DrinksSection />

          {meals.length > 0 && (
            <View style={styles.manualMealsContainer}>
              <Text style={styles.sectionTitle}>Manually Added Meals</Text>
              {meals.map((meal) => (
                <View key={meal.id} style={styles.mealItem}>
                  <Text style={styles.mealName}>{meal.foodName}</Text>
                  <Text style={styles.mealDetails}>
                    {meal.calories} kcal · P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
    marginLeft: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginTop: 24,
    marginBottom: 8,
  },
  manualMealsContainer: {
    marginTop: 16,
  },
  mealItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  mealDetails: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
});
