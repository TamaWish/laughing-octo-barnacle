import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SkillsPanel = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Skills</Text>
    <Text>This feature is coming soon!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SkillsPanel;