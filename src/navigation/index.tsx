import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, GameScreen, LoadingScreen } from '../screens';
import { Profile } from '../types/profile';

export type RootStackParamList = {
  Loading: undefined;
  Landing: undefined;
  Home: undefined;
  Game: { profile?: Profile } | undefined;
  Load: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Landing" component={/* lazy */ (require('../screens/LandingScreen').default)} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Load" component={/* lazy */ (require('../screens/LoadGameScreen').default)} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
