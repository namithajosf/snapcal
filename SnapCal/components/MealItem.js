import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// MealItem.js
export default function MealItem({ meal, onPress, loggedMeals, loading, navigation }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  // console.log(loggedMeals);


  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={meal.icon} style={styles.icon} />
          <Text style={styles.mealText}>{meal.type}</Text>
        </View>

        <TouchableOpacity onPress={onPress} style={styles.plusIcon}>
          <FontAwesome name="plus-circle" size={24} color="#2F855A" />
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          {loading ? (
            <Text style={styles.expandedText}>Loading...</Text>
          ) : loggedMeals.length === 0 ? (
            <Text style={styles.expandedText}>No meals logged yet.</Text>
          ) : (
            loggedMeals.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.mealItemCard}
                onPress={() => navigation.navigate('ViewMeal', { meal: item })}
              >
                <View style={styles.mealItemRow}>
                  <Text style={styles.mealName}>{item.meal_name}</Text>
                  <Text style={styles.mealCalories}>{item.consumed_calories} kcal</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  mealText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F855A',
  },
  plusIcon: {
    paddingLeft: 16,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  expandedText: {
    fontSize: 14,
    color: '#4A5568',
  },
  mealItemCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  
  mealItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  mealName: {
    fontSize: 16,
    color: '#2F855A',
    fontWeight: '500',
  },
  
  mealCalories: {
    fontSize: 14,
    color: '#4A5568',
  },
  
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  
});
