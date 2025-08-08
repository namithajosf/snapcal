import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CalorieTracker from '../components/CalorieTracker';
import MealsList from '../components/MealsList';
import DrinksSection from '../components/DrinksSection';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ navigation }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Store user ID here

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const userId = userData?.id;

        if (!userId) throw new Error('User ID missing');
        setUserId(userId); // Set the user ID in state

        const response = await axios.get(`http://192.168.141.84:8000/meals/${userId}`);
        setMeals(response.data);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load meals from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleAddMeal = () => {
    navigation.navigate('AddMeal');
  };

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
          {/* CalorieTracker and NutrientBar Components */}
          {userId && (
            <>
              <CalorieTracker userId={userId} />
            </>
          )}

          {/* Meals List */}
          <MealsList
            navigation={navigation}
            onAddMeal={handleAddMeal}
            meals={meals}
            loading={loading}
          />

          {/* Drinks Section */}
          <DrinksSection />
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
});
