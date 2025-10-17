import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { characters, resolveAvatar } from '../constants/characters';
import useGameStore from '../store/gameStore';

const NEW_KEY = 'simslyfe-saves';
const NEW_CURRENT_KEY = 'simslyfe-current';

export default function HeaderShell({ children, navigation }: any) {
  const profile = useGameStore((s) => s.profile);
  const age = useGameStore((s) => s.age);
  const happiness = useGameStore((s) => s.happiness);
  const health = useGameStore((s) => s.health);
  const isCurrentlyEnrolled = useGameStore((s) => s.isCurrentlyEnrolled);
  const currentEnrollment = useGameStore((s) => s.currentEnrollment);
  const gameDate = useGameStore((s) => s.gameDate);

  const avatarSource = profile ? resolveAvatar(profile) : undefined;

  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);
  const [loadVisible, setLoadVisible] = React.useState(false);
  const [savedSlots, setSavedSlots] = React.useState<any[]>([]);
  const [currentSaveId, setCurrentSaveId] = React.useState<string | null>(null);

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  const readSaves = async () => {
    try {
      const raw = await AsyncStorage.getItem(NEW_KEY);
      if (!raw) return [] as any[];
      return JSON.parse(raw) as any[];
    } catch (e) {
      console.warn('readSaves failed', e);
      return [] as any[];
    }
  };

  const refreshSaves = async () => {
    const arr = await readSaves();
    setSavedSlots(arr || []);
  };

  const saveProfile = async () => {
    try {
      const id = makeId();
      const st = useGameStore.getState();
      const slot = { id, name: `Save ${new Date().toLocaleString()}`, state: st, profile: st.profile };
      const arr = await readSaves();
      arr.push(slot);
      await AsyncStorage.setItem(NEW_KEY, JSON.stringify(arr));
      await AsyncStorage.setItem(NEW_CURRENT_KEY, id);
      setCurrentSaveId(id);
      setSavedSlots(arr);
      Toast.show({ type: 'success', text1: 'Game Saved', text2: 'Progress has been saved successfully' });
    } catch (e) {
      console.warn('save failed', e);
      Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Unable to save game progress' });
    }
  };

  const loadProfile = async (slot: any) => {
    try {
      const st = useGameStore.getState();
      Object.keys(slot.state).forEach(key => {
        if (key in st) {
          (st as any)[key] = slot.state[key];
        }
      });
      await AsyncStorage.setItem(NEW_CURRENT_KEY, slot.id);
      setCurrentSaveId(slot.id);
      setLoadVisible(false);
      Toast.show({ type: 'success', text1: 'Game Loaded', text2: 'Save file loaded successfully' });
    } catch (e) {
      console.warn('load failed', e);
      Toast.show({ type: 'error', text1: 'Load Failed', text2: 'Unable to load save file' });
    }
  };

  const deleteProfile = async (id: string) => {
    Alert.alert('Delete Save', 'Are you sure you want to delete this save file? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const arr = await readSaves();
            const next = (arr || []).filter((x: any) => x.id !== id);
            await AsyncStorage.setItem(NEW_KEY, JSON.stringify(next));
            setSavedSlots(next);
            const cur = await AsyncStorage.getItem(NEW_CURRENT_KEY);
            if (cur === id) {
              await AsyncStorage.removeItem(NEW_CURRENT_KEY);
              setCurrentSaveId(null);
            }
          } catch (e) {
            console.warn('delete failed', e);
          }
        }
      }
    ]);
  };

  React.useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const cur = await AsyncStorage.getItem(NEW_CURRENT_KEY);
        if (!mounted) return;
        if (cur) setCurrentSaveId(cur);
      } catch (e) {
        console.warn('load current id failed', e);
      }
      await refreshSaves();
    };
    init();
    return () => { mounted = false; };
  }, []);

  // autosave registration performed once here so store actions trigger deterministic saves
  React.useEffect(() => {
    const autosaveCb = async () => {
      if (!currentSaveId) return;
      try {
        const arr = await readSaves();
        const idx = (arr || []).findIndex((x: any) => x.id === currentSaveId);
        if (idx === -1) return;
        const st = useGameStore.getState();
        arr[idx] = { ...arr[idx], state: st, profile: st.profile };
        await AsyncStorage.setItem(NEW_KEY, JSON.stringify(arr));
        setSavedSlots(arr);
      } catch (e) {
        console.warn('autosave callback failed', e);
      }
    };

    const setCb = useGameStore.getState().setAutosaveCallback;
    setCb && setCb(autosaveCb);
    return () => { setCb && setCb(null); };
  }, [currentSaveId]);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Header/Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setProfileVisible(true)} accessibilityRole="button" accessibilityLabel="Open profile">
            {avatarSource ? <Image source={avatarSource} style={styles.statusAvatar} /> : <View style={styles.statusAvatarPlaceholder} />}
          </TouchableOpacity>
          <View style={styles.statusTextWrap}>
            <View style={styles.nameRow}><Text style={styles.statusName}>{profile ? `${profile.firstName} ${profile.lastName}` : 'Your Sim'}</Text></View>
            <Text style={styles.statusMeta}>Age {age} • {profile ? (profile.country ?? '') : ''}</Text>
            {isCurrentlyEnrolled && currentEnrollment ? (
              <View style={{ marginTop: 6 }}>
                <Text style={{ color: '#cfeafc', fontSize: 12 }}>{currentEnrollment.name} — {Math.max(0, currentEnrollment.timeRemaining)} yr remaining</Text>
                {/* Progress bar */}
                <View style={{ height: 8, backgroundColor: '#0b3042', borderRadius: 6, marginTop: 6, overflow: 'hidden' }}>
                  {(() => {
                    const dur = (currentEnrollment.duration || 1);
                    const rem = Math.max(0, currentEnrollment.timeRemaining || 0);
                    const completed = Math.max(0, dur - rem);
                    const pct = Math.max(0, Math.min(100, Math.round((completed / dur) * 100)));
                    return <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#2ecc71' }} />;
                  })()}
                </View>
                {/* Estimated graduation */}
                {gameDate ? (() => {
                  try {
                    const d = new Date(gameDate);
                    const rem = Math.max(0, currentEnrollment.timeRemaining || 0);
                    const grad = new Date(d);
                    grad.setFullYear(grad.getFullYear() + Math.ceil(rem));
                    return <Text style={{ color: '#cfeafc', fontSize: 11, marginTop: 4 }}>Est. graduation: {grad.toLocaleDateString()}</Text>;
                  } catch (e) { return null; }
                })() : null}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.statusRight}>
          <View style={styles.gameStat}><Text style={styles.gameStatIcon}>😊</Text><Text style={styles.gameStatText}>{happiness ?? 0}%</Text></View>
          <View style={styles.gameStat}><Text style={styles.gameStatIcon}>❤️</Text><Text style={styles.gameStatText}>{health ?? 0}%</Text></View>
          <TouchableOpacity style={styles.gameStat} onPress={() => setSettingsVisible(true)} accessibilityRole="button" accessibilityLabel="Settings">
            <MaterialCommunityIcons name="cog-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Settings Modal */}
      <Modal visible={settingsVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity style={styles.modalButton} onPress={saveProfile}>
            <Text style={styles.modalButtonText}>Save Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => { setLoadVisible(true); setSettingsVisible(false); }}>
            <Text style={styles.modalButtonText}>Load Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setSettingsVisible(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal visible={profileVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Profile</Text>
          {avatarSource && <Image source={avatarSource} style={styles.profileAvatar} />}
          <Text style={styles.profileText}>Name: {profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown'}</Text>
          <Text style={styles.profileText}>Age: {age}</Text>
          <Text style={styles.profileText}>Country: {profile?.country || 'Unknown'}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setProfileVisible(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Load Modal */}
      <Modal visible={loadVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Load Game</Text>
          <TouchableOpacity style={styles.modalButton} onPress={refreshSaves}>
            <Text style={styles.modalButtonText}>Refresh Saves</Text>
          </TouchableOpacity>
          {savedSlots.map((slot: any) => (
            <View key={slot.id} style={styles.saveSlot}>
              <Text style={styles.saveSlotText}>{slot.name}</Text>
              <View style={styles.saveSlotButtons}>
                <TouchableOpacity style={styles.loadButton} onPress={() => loadProfile(slot)}>
                  <Text style={styles.loadButtonText}>Load</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProfile(slot.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.modalButton} onPress={() => setLoadVisible(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: { height: 80, backgroundColor: '#1a4d6a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40 },
  statusLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { marginRight: 12, padding: 4 },
  statusAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  statusAvatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#666', marginRight: 12 },
  statusTextWrap: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  statusName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statusMeta: { color: '#bcd7e6', fontSize: 12 },
  statusRight: { flexDirection: 'row', alignItems: 'center' },
  gameStat: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  gameStatIcon: { color: '#fff', marginRight: 6 },
  gameStatText: { color: '#fff', fontWeight: '700' },
  modalContent: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginBottom: 20 },
  profileText: { fontSize: 16, marginBottom: 10 },
  saveSlot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 8 },
  saveSlotText: { fontSize: 16, flex: 1 },
  saveSlotButtons: { flexDirection: 'row' },
  loadButton: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 8 },
  loadButtonText: { color: '#fff', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#f44336', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
});