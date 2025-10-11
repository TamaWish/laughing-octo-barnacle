import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import useGameStore from '../store/gameStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  const profile = useGameStore((s) => s.profile);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SimsLyfe</Text>
      <View style={styles.buttons}>
        <Button
          title="Continue"
          onPress={() => {
            if (profile) {
              navigation.replace('Game', { profile });
            } else {
              // no profile saved, go to new game flow
              navigation.navigate('Home');
            }
          }}
        />
        <View style={styles.spacer} />
        <Button
          title="New Game"
          onPress={() => {
            // clear any existing profile in store and go to Home to create new
            useGameStore.getState().reset();
            navigation.navigate('Home');
          }}
        />
        <View style={styles.spacer} />
        <Button
          title="Load Game"
          onPress={() => navigation.navigate('Load')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 24 },
  buttons: { width: '100%' },
  spacer: { height: 12 },
});
