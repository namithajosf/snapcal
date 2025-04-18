import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddMealScreen from '../screens/AddMealScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PreviewScreen from '../screens/PreviewScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AddMeal" component={AddMealScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen 
      name="PreviewScreen" 
      component={PreviewScreen}
      options={{
        presentation: 'transparentModal',
        cardOverlayEnabled: true,
        cardStyle: { backgroundColor: 'transparent' }
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;