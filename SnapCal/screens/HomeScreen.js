import React from 'react';
import { StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CalorieTracker from '../components/CalorieTracker';
import MealsList from '../components/MealsList';
import DrinksSection from '../components/DrinksSection';
import { FontAwesome } from '@expo/vector-icons';


export default function HomeScreen({ navigation }) {

  return (
    <>
      <StatusBar 
        backgroundColor="#F9FAFB" 
        barStyle="dark-content" 
      />
      <SafeAreaView 
        style={styles.container} 
        edges={['top']}
      >
      <Header 
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
});