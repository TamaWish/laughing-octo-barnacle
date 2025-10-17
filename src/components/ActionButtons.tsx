import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ActionButtonsProps {
  onAdvanceYear: () => void;
  onEducation: () => void;
}

export default function ActionButtons({ onAdvanceYear, onEducation }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.advanceButton]} 
        onPress={onAdvanceYear}
        accessibilityRole="button"
        accessibilityLabel="Advance year"
      >
        <MaterialCommunityIcons name="calendar-arrow-right" size={20} color="#fff" />
        <Text style={styles.buttonText}>Advance Year</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.educationButton]} 
        onPress={onEducation}
        accessibilityRole="button"
        accessibilityLabel="Education"
      >
        <MaterialCommunityIcons name="school" size={20} color="#fff" />
        <Text style={styles.buttonText}>Education</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  advanceButton: {
    backgroundColor: '#10b981',
  },
  educationButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
