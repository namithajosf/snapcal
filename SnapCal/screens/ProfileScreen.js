import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNutrition } from '../contexts/NutritionContext';

export default function ProfileScreen() {
  const { dailyGoal, setDailyGoal } = useNutrition();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <FontAwesome name="user-circle" size={80} color="#2F855A" />
          </View>
          
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userStats}>30 years | 180 cm | 75 kg</Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Goals</Text>
          
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Daily Calorie Goal</Text>
            <Text style={styles.goalValue}>{dailyGoal} kcal</Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Daily Water Goal</Text>
            <Text style={styles.goalValue}>8 glasses</Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Target Weight</Text>
            <Text style={styles.goalValue}>70 kg</Text>
          </View>
          
          <TouchableOpacity style={styles.sectionButton}>
            <Text style={styles.sectionButtonText}>Update Goals</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Units</Text>
            <View style={styles.preferenceValue}>
              <Text>Metric</Text>
              <FontAwesome name="chevron-right" size={16} color="#A0AEC0" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Notifications</Text>
            <View style={styles.preferenceValue}>
              <Text>On</Text>
              <FontAwesome name="chevron-right" size={16} color="#A0AEC0" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Theme</Text>
            <View style={styles.preferenceValue}>
              <Text>Light</Text>
              <FontAwesome name="chevron-right" size={16} color="#A0AEC0" />
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: '#2D3748',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  goalLabel: {
    fontSize: 16,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F855A',
  },
  sectionButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  sectionButtonText: {
    color: '#2F855A',
    fontWeight: '500',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  preferenceLabel: {
    fontSize: 16,
  },
  preferenceValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FEB2B2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#C53030',
    fontWeight: 'bold',
    fontSize: 16,
  },
});