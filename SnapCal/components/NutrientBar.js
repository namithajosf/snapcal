import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function NutrientBar({ userId }) {
  const [nutritionData, setNutritionData] = useState(null);  
  const [mealsData, setMealsData] = useState([]);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    if (userId) {
      axios.get(`http://192.168.141.84:8000/nutrition-goals/${userId}`)
        .then(response => {
          setNutritionData(response.data);
        })
        .catch(error => {
          console.error('Error fetching nutrition data:', error);
        });

      axios.get(`http://192.168.141.84:8000/meals/${userId}`)
        .then(response => {
          setMealsData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching meals data:', error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!nutritionData || !mealsData) {
    return <Text>No data available</Text>;
  }

  const totalFatConsumed = mealsData.reduce((total, meal) => total + (meal.fat_consumed || 0), 0);
  const totalProteinConsumed = mealsData.reduce((total, meal) => total + (meal.protein_consumed || 0), 0);
  const totalCarbsConsumed = mealsData.reduce((total, meal) => total + (meal.carbs_consumed || 0), 0);

  const { fat_goal, protein_goal, carbs_goal } = nutritionData;

  const calculatePercentage = (consumed, goal) => (consumed / goal) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>Fat</Text>
        <View style={styles.nutrientBarContainer}>
          <View
            style={[styles.nutrientBar, { width: `${calculatePercentage(totalFatConsumed, fat_goal)}%`, backgroundColor: '#F6E05E' }]}
          />
        </View>
        <Text style={styles.nutrientValue}>{totalFatConsumed}/{fat_goal}g</Text>
      </View>

      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>Protein</Text>
        <View style={styles.nutrientBarContainer}>
          <View
            style={[styles.nutrientBar, { width: `${calculatePercentage(totalProteinConsumed, protein_goal)}%`, backgroundColor: '#68D391' }]}
          />
        </View>
        <Text style={styles.nutrientValue}>{totalProteinConsumed}/{protein_goal}g</Text>
      </View>

      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>Carbs</Text>
        <View style={styles.nutrientBarContainer}>
          <View
            style={[styles.nutrientBar, { width: `${calculatePercentage(totalCarbsConsumed, carbs_goal)}%`, backgroundColor: '#F6AD55' }]}
          />
        </View>
        <Text style={styles.nutrientValue}>{totalCarbsConsumed}/{carbs_goal}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
