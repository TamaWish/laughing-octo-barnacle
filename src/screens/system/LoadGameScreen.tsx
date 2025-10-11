import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGameStore from '../../store/gameStore';
import { Profile } from '../../types/profile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { characters, resolveAvatar } from '../../constants/characters';

type Props = NativeStackScreenProps<RootStackParamList, 'Load'>;

type SaveSlot = { id: string; profile: Profile; state: any; createdAt: number; name?: string };

const OLD_KEY = 'simslyfe-storage';
const NEW_KEY = 'simslyfe-saves';

function makeId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

export default function LoadGameScreen({ navigation }: Props) {
  const [slots, setSlots] = useState<SaveSlot[]>([]);

  const readSaves = async () => {
    try { const raw = await AsyncStorage.getItem(NEW_KEY); if (!raw) return [] as SaveSlot[]; const parsed = JSON.parse(raw) as SaveSlot[]; return parsed; } catch (e) { console.warn('readSaves failed', e); return [] as SaveSlot[]; }
  };

  const writeSaves = async (arr: SaveSlot[]) => { await AsyncStorage.setItem(NEW_KEY, JSON.stringify(arr)); };

  const migrateIfNeeded = async () => {
    try {
      const existing = await AsyncStorage.getItem(NEW_KEY);
      if (existing) return;
      const oldRaw = await AsyncStorage.getItem(OLD_KEY);
      if (!oldRaw) return;
      const parsed = JSON.parse(oldRaw);
      const state = parsed?.state ?? parsed ?? null;
      if (!state) return;
      const slot: SaveSlot = { id: makeId(), profile: state.profile, state, createdAt: Date.now(), name: state.profile ? `${state.profile.firstName} ${state.profile.lastName}` : 'Save 1' };
      await writeSaves([slot]);
    } catch (e) { console.warn('migrate failed', e); }
  };

  const refresh = async () => { await migrateIfNeeded(); const s = await readSaves(); setSlots(s); };

  useEffect(() => { refresh(); }, []);

  const doLoad = async (slot: SaveSlot) => {
    try { (useGameStore as any).setState(slot.state ?? {}); navigation.replace('Game', { profile: slot.profile }); } catch (e) { console.warn('load failed', e); Alert.alert('Load failed', 'Could not load the selected save.'); }
  };

  const doDelete = (id: string) => {
    Alert.alert('Delete Save', 'Are you sure you want to delete this save?', [ { text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { const s = await readSaves(); const next = s.filter((x) => x.id !== id); await writeSaves(next); setSlots(next); } catch (e) { console.warn('delete failed', e); } } } ]);
  };

  const renderSlot = ({ item }: { item: SaveSlot }) => {
    const avatar = resolveAvatar(item.profile) ?? characters[0];
    const when = new Date(item.createdAt).toLocaleString();
    const subtitle = item.profile ? `${item.profile.country}` : '';
    return (
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={avatar} style={styles.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{item.name ?? `${item.profile?.firstName ?? 'Unknown'} ${item.profile?.lastName ?? ''}`}</Text>
            <Text style={styles.meta}>{subtitle} • {when}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => doLoad(item)} style={styles.loadBtn}><Text>Load</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => doDelete(item.id)} style={styles.delBtn}><Text style={{ color: 'crimson' }}>Delete</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Load Game</Text>
      {slots.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <Text>No saved profiles found.</Text>
          <View style={{ height: 12 }} />
          <Button title="Start New Game" onPress={() => navigation.navigate('Home')} />
        </View>
      ) : (
        <FlatList data={slots} keyExtractor={(i) => i.id} renderItem={renderSlot} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 22, marginBottom: 12 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }, actions: { flexDirection: 'row' }, loadBtn: { padding: 8, marginRight: 8, backgroundColor: '#e6f0ff', borderRadius: 6 }, delBtn: { padding: 8 }, avatar: { width: 56, height: 56, borderRadius: 6 }, name: { fontSize: 16, fontWeight: '600' }, meta: { color: '#666' } });
