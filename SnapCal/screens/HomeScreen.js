import React from 'react';
import { StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import CalorieTracker from '../components/CalorieTracker';
import MealsList from '../components/MealsList';
import DrinksSection from '../components/DrinksSection';

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
        <Header />
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