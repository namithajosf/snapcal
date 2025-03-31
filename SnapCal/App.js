import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { NutritionProvider } from './contexts/NutritionContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <NutritionProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </NutritionProvider>
  );
}
