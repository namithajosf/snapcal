import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNutrition } from '../contexts/NutritionContext';
import { AuthContext } from '../contexts/authContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileScreen = () => {
  const { dailyGoal } = useNutrition();
  const { setIsLoggedIn } = useContext(AuthContext);
  
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(new Date());

  useEffect(() => {
    const loadUser = async () => {
      const raw = await AsyncStorage.getItem('userData');
      const user = raw ? JSON.parse(raw) : null;
      setUserData(user);
      setUpdatedUserData(user || {});
      if (user?.dob) {
        setDob(new Date(user.dob));
      }
    };
    loadUser();
  }, []);

  // Calculate age based on DOB
  const calculateAge = (dobString) => {
    if (!dobString) return null;

    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (field, value) => {
    setUpdatedUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://192.168.141.84:8000/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserData),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setIsEditing(false);
        Alert.alert('Profile updated successfully!');
      } else {
        Alert.alert('Error', result.message || 'An error occurred while updating your profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile.');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: handleLogout },
    ]);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
    setUpdatedUserData((prev) => ({
      ...prev,
      dob: currentDate.toISOString(),
    }));
  };

  const age = userData?.dob ? calculateAge(userData.dob) : '--';
  const first_name = userData?.first_name || '--';
  const last_name = userData?.last_name || '--';
  const email = userData?.email || '--';

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

          <Text style={styles.username}>{userData?.username || 'username'}</Text>

          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={updatedUserData.first_name || ''}
                onChangeText={(value) => handleInputChange('first_name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={updatedUserData.last_name || ''}
                onChangeText={(value) => handleInputChange('last_name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={updatedUserData.email || ''}
                onChangeText={(value) => handleInputChange('email', value)}
              />

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text style={{ fontSize: 16, color: '#718096' }}>
                  {dob ? dob.toLocaleDateString() : 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={onChangeDob}
                />
              )}
            </>
          ) : (
            <>
              <Text style={styles.userStats}>{first_name} {last_name}</Text>
              <Text style={styles.userStats}>{age} years</Text>
              <Text style={styles.userStats}>{email}</Text>
            </>
          )}

          <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
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

          <TouchableOpacity style={styles.sectionButton}>
            <Text style={styles.sectionButtonText}>Update Goals</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  editButtonText: {
    color: '#2D3748',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2F855A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
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

export default ProfileScreen;
