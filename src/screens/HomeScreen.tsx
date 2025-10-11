import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { characters } from '../constants/characters';
import useGameStore from '../store/gameStore';
import { Profile } from '../types/profile';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const FIRST_NAMES = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Jamie', 'Morgan'];
const LAST_NAMES = ['Smith', 'Johnson', 'Lee', 'Garcia', 'Brown', 'Davis', 'Miller', 'Wilson'];

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

export default function HomeScreen({ navigation }: Props) {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [inlineErrors, setInlineErrors] = useState<string[]>([]);

  const randomizeName = () => {
    const f = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const l = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    setFirstName(f);
    setLastName(l);
  };

  const startGame = () => {
    // Validation
    const errors: string[] = [];
    if ((firstName.trim() || '').length < 2) errors.push('First name must be at least 2 characters.');
    if ((lastName.trim() || '').length < 2) errors.push('Last name must be at least 2 characters.');
    if (firstName.trim().length > 24) errors.push('First name must be <= 24 characters.');
    if (lastName.trim().length > 24) errors.push('Last name must be <= 24 characters.');

    if (errors.length > 0) {
      setInlineErrors(errors);
      return;
    }

    const profile: Profile = {
      avatar: avatarIndex,
      gender,
      firstName: firstName.trim() || FIRST_NAMES[0],
      lastName: lastName.trim() || LAST_NAMES[0],
      country: country.code,
    };

    // persist in store
    const setProfile = useGameStore.getState().setProfile;
    setProfile(profile);

    navigation.navigate('Game', { profile });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create your Sim</Text>

      <View style={styles.previewRow}>
        <Image source={characters[avatarIndex]} style={styles.previewAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.previewName}>{`${firstName || 'First'} ${lastName || 'Last'}`}</Text>
          <Text style={styles.previewMeta}>{`${gender.toUpperCase()} • ${country.flag} ${country.name}`}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Pick Avatar</Text>
        <FlatList
          data={characters}
          keyExtractor={(_, i) => String(i)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setAvatarIndex(index)} style={styles.avatarButton}>
              <Image source={item} style={[styles.avatarThumb, avatarIndex === index && styles.avatarSelected]} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.row}> 
          <TouchableOpacity onPress={() => setGender('male')} style={[styles.choice, gender === 'male' && styles.choiceSelected]}>
            <Text>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGender('female')} style={[styles.choice, gender === 'female' && styles.choiceSelected]}>
            <Text>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGender('other')} style={[styles.choice, gender === 'other' && styles.choiceSelected]}>
            <Text>Other</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput placeholder="First name" value={firstName} onChangeText={setFirstName} style={[styles.input, { marginRight: 8 }]} />
          <TextInput placeholder="Last name" value={lastName} onChangeText={setLastName} style={styles.input} />
        </View>
        <View style={{ marginTop: 8 }}>
          <Button title="Randomize Name" onPress={randomizeName} />
        </View>
        {inlineErrors.length > 0 && (
          <View style={{ marginTop: 8 }}>
            {inlineErrors.map((e, i) => (
              <Text key={i} style={{ color: 'crimson' }}>
                {e}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Country</Text>
        <FlatList
          data={COUNTRIES}
          keyExtractor={(c) => c.code}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setCountry(item)} style={[styles.country, country.code === item.code && styles.countrySelected]}>
              <Text style={{ fontSize: 18 }}>{item.flag}</Text>
              <Text style={{ marginTop: 4 }}>{item.code}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ marginTop: 16, width: '100%' }}>
        <Button title="Start New Life" onPress={startGame} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'stretch' },
  title: { fontSize: 28, marginBottom: 16, alignSelf: 'center' },
  previewRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  previewAvatar: { width: 96, height: 96, marginRight: 12, borderRadius: 8 },
  previewName: { fontSize: 18, fontWeight: '600' },
  previewMeta: { color: '#666' },
  section: { marginVertical: 8 },
  label: { fontWeight: '600', marginBottom: 8 },
  avatarThumb: { width: 64, height: 64, marginRight: 8, borderRadius: 6, opacity: 0.9 },
  avatarButton: { padding: 4 },
  avatarSelected: { borderWidth: 2, borderColor: '#007aff' },
  row: { flexDirection: 'row' },
  choice: { padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginRight: 8 },
  choiceSelected: { backgroundColor: '#e6f0ff', borderColor: '#007aff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  country: { padding: 8, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
  countrySelected: { borderColor: '#007aff', backgroundColor: '#eaf4ff' },
});
