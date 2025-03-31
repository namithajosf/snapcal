import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NutrientBar({ label, consumed, goal, color }) {
  const percentage = (consumed / goal) * 100;
  
  return (
    <View style={styles.nutrientRow}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <View style={styles.nutrientBarContainer}>
        <View
          style={[styles.nutrientBar, { width: `${percentage}%`, backgroundColor: color }]}
        />
      </View>
      <Text style={styles.nutrientValue}>{consumed}/{goal}g</Text>
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
