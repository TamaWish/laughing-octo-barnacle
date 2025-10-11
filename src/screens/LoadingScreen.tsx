import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setPercent(Math.round(value * 100)));

    Animated.timing(progress, { toValue: 1, duration: 3000, useNativeDriver: false }).start(() => {
      // remove listener and navigate
      progress.removeListener(id);
      navigation.replace('Landing');
    });

    return () => {
      try {
        progress.removeListener(id);
      } catch (e) {
        // ignore if already removed
      }
    };
  }, [navigation, progress]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['5%', '90%'] });

  return (
    <LinearGradient colors={["#4db6ff", "#c56cff"]} style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width }]} />
      </View>
      <Text style={styles.percent}>{percent}%</Text>
      <Text style={styles.desc}>Loading your destiny...</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 360, height: 220, marginBottom: 40 },
  barBackground: { width: '80%', height: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 12, backgroundColor: '#ffeb3b' },
  percent: { marginTop: 10, color: '#fff' },
  desc: { marginTop: 6, color: '#fff', opacity: 0.9 },
});
