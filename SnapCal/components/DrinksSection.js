import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WaterTracker from './WaterTracker';

export default function DrinksSection() {
  return (
    <View style={styles.drinksSection}>
      <Text style={styles.sectionTitle}>Drinks</Text>
      <View style={styles.drinksContainer}>
        <WaterTracker />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drinksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 16,
  },
  drinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
