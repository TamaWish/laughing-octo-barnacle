import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EducationInfoProps {
  schoolName: string;
  yearsRemaining: number;
  progress: number; // 0-100
  graduationDate: string;
  currentGPA?: number;
}

export default function EducationInfo({ 
  schoolName, 
  yearsRemaining, 
  progress,
  graduationDate,
  currentGPA
}: EducationInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.schoolName}>
        {schoolName} — {yearsRemaining} yr remaining
      </Text>
      {currentGPA && (
        <Text style={styles.gpaText}>
          Current GPA: {currentGPA.toFixed(2)}
        </Text>
      )}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.graduationText}>
        Est. graduation: {graduationDate}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  gpaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
    marginTop: 4,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  graduationText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
    textAlign: 'center',
  },
});
