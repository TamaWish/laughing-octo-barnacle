import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatBar = ({ label, value, color }: { label: string; value: number; color?: string }) => (
  <View style={styles.statBarRow}>
    <Text style={styles.statBarLabel}>{label}</Text>
    <View style={styles.statBarTrack}>
      <View style={[styles.statBarFill, { width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color ?? '#3bc14a' }]} />
    </View>
    <Text style={styles.statBarValue}>{value}%</Text>
  </View>
);

const styles = StyleSheet.create({
  statBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statBarLabel: { width: 80, color: '#333' },
  statBarTrack: { flex: 1, height: 10, backgroundColor: '#e6eef6', borderRadius: 6, marginHorizontal: 8, overflow: 'hidden' },
  statBarFill: { height: 10, borderRadius: 6 },
  statBarValue: { width: 36, textAlign: 'right' },
});

export default StatBar;