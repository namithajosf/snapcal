import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>SnapCal</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <FontAwesome name="user-circle" size={24} color="#2F855A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
  },
});
