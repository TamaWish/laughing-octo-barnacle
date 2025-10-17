import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AssetsPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assets</Text>
      <Text>This is the assets panel.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
});