import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header({ leftComponent, rightComponent }) {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {leftComponent}
        <Text style={styles.headerText}>SnapCal</Text>
      </View>
      {rightComponent || <View style={{ width: 24 }} />}  
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
    marginLeft: 3
  },
});
