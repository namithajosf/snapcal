import React from 'react';
import { 
  StyleSheet, 
  View, 
} from 'react-native';

export default function Header({ 
  leftComponent, 
  rightComponent,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {leftComponent}
      </View>
      {rightComponent || <View style={{ width: 24 }} />}  
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F855A',
  },
});