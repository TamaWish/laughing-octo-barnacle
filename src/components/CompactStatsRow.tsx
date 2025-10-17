import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CompactStatsRowProps {
  happiness: number;
  health: number;
  money: number;
  moneyFormatter: Intl.NumberFormat;
}

export default function CompactStatsRow({ 
  happiness, 
  health, 
  money,
  moneyFormatter 
}: CompactStatsRowProps) {
  // Dynamic color for happiness
  const getHappinessColor = (value: number) => {
    if (value < 50) return '#f59e0b'; // orange
    return '#eab308'; // yellow
  };

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.icon}>😊</Text>
        <Text style={[styles.value, { color: getHappinessColor(happiness) }]}>
          {happiness}%
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={[styles.value, { color: '#ef4444' }]}>
          {health}%
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.icon}>💰</Text>
        <Text style={[styles.value, { color: '#10b981' }]}>
          {moneyFormatter.format(money)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
