import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Avoid importing from the `src/screens` barrel here because some screens (eg HomeScreen)
// import this navigation module — that creates a require cycle which can cause
// uninitialized values at runtime. Use direct (or lazy) requires below instead.
import { Profile } from '../types/profile';

export type TabKey = 'Home' | 'Career' | 'Assets' | 'Skills' | 'Relationships' | 'Activities' | 'More';

export type RootStackParamList = {
  Loading: undefined;
  Landing: undefined;
  Home: undefined;
  Game: { profile?: Profile; initialTab?: TabKey } | undefined;
  Education: undefined;
  Activities: undefined;
  Assets: undefined;
  Load: undefined;
  Relationships: undefined;
  Career: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={/* lazy */ (require('../screens/system/LoadingScreen').default)} />
        <Stack.Screen name="Landing" component={/* lazy */ (require('../screens/system/LandingScreen').default)} />
        <Stack.Screen name="Home" component={/* lazy */ (require('../screens/system/HomeScreen').default)} />
        <Stack.Screen name="Activities" component={/* lazy */ (require('../screens/wrappers/ActivitiesWrapped').default)} />
        <Stack.Screen name="Education" component={/* lazy */ (require('../screens/wrappers/EducationWrapped').default)} />
        <Stack.Screen name="Assets" component={/* lazy */ (require('../screens/AssetsScreen').default)} />
        <Stack.Screen name="Load" component={/* lazy */ (require('../screens/system/LoadGameScreen').default)} />
        <Stack.Screen name="Game" component={/* lazy */ (require('../screens/wrappers/GameWrapped').default)} />
        <Stack.Screen name="Career" component={/* lazy */ (require('../screens/wrappers/CareerWrapped').default)} />
        <Stack.Screen name="Relationships" component={/* lazy */ (require('../screens/wrappers/RelationshipsWrapped').default)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// helper to navigate to the Game screen with a typed tab
export function navigateToGame(navigation: any, tab: TabKey, profile?: Profile) {
  navigation.navigate('Game', { initialTab: tab, profile });
}
