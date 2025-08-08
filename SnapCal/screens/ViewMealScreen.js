import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';

export default function ViewMealScreen({ route, navigation }) {
  const { meal } = route.params || {};

  console.log(meal);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header
        leftComponent={<Text style={styles.headerLeftText}>Meal Details</Text>}
        navigation={navigation}
      />

      <Image
        style={styles.image}
        source={
          meal.imageUri
            ? { uri: meal.imageUri }
            : require('../assets/placeholder.png')
        }
      />

      <Text style={styles.title}>{meal.meal_name || meal.title}</Text>
      <Text style={styles.subText}>Meal Type: {meal.meal_type}</Text>

      <Text style={styles.subHeading}>Meal Info</Text>
      <View style={styles.card}>
        <Info label="Calories" value={`${meal.consumed_calories} kcal`} />
        <Info label="Fat" value={`${meal.fat_consumed} g`} />
        <Info label="Protein" value={`${meal.protein_consumed} g`} />
        <Info label="Carbs" value={`${meal.carbs_consumed} g`} />
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.confirmText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  headerLeftText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#204201',
  },
  value: {
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#216a35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
