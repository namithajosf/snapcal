import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Svg, { Circle } from 'react-native-svg';
import NutrientBar from './NutrientBar'; // Assuming NutrientBar is another component

export default function CalorieTracker({ userId }) {
  const [nutritionData, setNutritionData] = useState(null);  
  const [mealsData, setMealsData] = useState([]);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const [nutritionRes, mealsRes] = await Promise.all([
            axios.get(`http://192.168.141.84:8000/nutrition-goals/${userId}`),
            axios.get(`http://192.168.141.84:8000/meals/${userId}`)
          ]);
          setNutritionData(nutritionRes.data);
          setMealsData(mealsRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!nutritionData) {
    return <Text>No nutrition data available</Text>;
  }

  const totalCaloriesConsumed = mealsData.reduce(
    (total, meal) => total + (meal.consumed_calories || 0),
    0
  );

  const daily_calories = nutritionData.daily_calories || 1; // prevent divide by 0

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 10;
  const strokeDashoffsetCalories = circumference - (totalCaloriesConsumed / daily_calories) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.calorieTracker}>
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
              strokeDashoffset={strokeDashoffsetCalories}
              strokeLinecap="round"
            />
          </Svg>

          <View style={styles.calorieTextWrapper}>
            <Text style={styles.calorieText}>{totalCaloriesConsumed}</Text>
            <Text style={styles.totalCalorieText}>/ {daily_calories} kcal</Text>
          </View>
        </View>
      </View>
      
      {/* NutrientBar Component */}
      <View style={styles.nutrientInfo}>
        <NutrientBar 
          userId={userId} // Pass the userId prop to NutrientBar
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // To align both components side by side
    justifyContent: 'space-between', // To space out the components
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  calorieTracker: {
    flex: 1, // To allow it to take up space on the left
    alignItems: 'center',
  },
  calorieCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  calorieTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  totalCalorieText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0AEC0',
  },
  nutrientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
});
