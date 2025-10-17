import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { characters, resolveAvatar } from '../constants/characters';
import useGameStore from '../store/gameStore';
import { NAV_HEIGHT } from '../constants/ui';

const NEW_KEY = 'simslyfe-saves';
const NEW_CURRENT_KEY = 'simslyfe-current';

export default function AppShell({ children, navigation }: any) {
  const profile = useGameStore((s) => s.profile);
  const age = useGameStore((s) => s.age);
  const happiness = useGameStore((s) => s.happiness);
  const health = useGameStore((s) => s.health);
  const smarts = useGameStore((s) => s.smarts);
  const looks = useGameStore((s) => s.looks);
  const fame = useGameStore((s) => s.fame);
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
      const st = useGameStore.getState();
      if (!st.profile) {
        Alert.alert('No profile', 'There is no profile to save.');
        return;
      }

      const slot = {
        id: makeId(),
        profile: st.profile,
        state: st,
        createdAt: Date.now(),
        name: `${st.profile.firstName} ${st.profile.lastName ?? ''}`,
      } as any;

      const raw = await AsyncStorage.getItem(NEW_KEY);
      const arr = raw ? (JSON.parse(raw) as any[]) : [];
      const next = [slot, ...(arr || [])];
      await AsyncStorage.setItem(NEW_KEY, JSON.stringify(next));
      await AsyncStorage.setItem(NEW_CURRENT_KEY, slot.id);
      setCurrentSaveId(slot.id);
      await refreshSaves();
      Toast.show({ type: 'success', text1: 'Saved', text2: 'Profile saved. Autosave enabled for this life.', position: 'bottom' });
    } catch (e) {
      console.warn('saveProfile failed', e);
      Alert.alert('Save failed', 'Could not save profile.');
    }
  };

  const loadSlot = async (slot: any) => {
    try {
      (useGameStore as any).setState(slot.state ?? {});
      await AsyncStorage.setItem(NEW_CURRENT_KEY, slot.id);
      setCurrentSaveId(slot.id);
      setLoadVisible(false);
      Alert.alert('Loaded', 'Profile loaded. Autosave active for this life.');
    } catch (e) {
      console.warn('load failed', e);
      Alert.alert('Load failed', 'Could not load the selected save.');
    }
  };

  const deleteSlot = (id: string) => {
    Alert.alert('Delete Save', 'Are you sure you want to delete this save?', [
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

  const currentGameTab = useGameStore((s) => s.currentGameTab);
  const setNavHeight = useGameStore((s) => s.setNavHeight);

  // helper to change in-game tab and navigate to Game only if we're not already there
  const goToGameTab = (tab: string) => {
    const setTab = useGameStore.getState().setCurrentGameTab;
    setTab && setTab(tab as any);
    try {
      const state = navigation && navigation.getState && navigation.getState();
      const currentRoute = state?.routes?.[state.index]?.name;
      if (currentRoute !== 'Game') {
        navigation && navigation.navigate('Game', { initialTab: tab });
      }
    } catch (e) {
      navigation && navigation.navigate('Game', { initialTab: tab });
    }
  };

  const money = useGameStore((s) => s.money);
  const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  function countryCodeToFlag(code?: string) {
    if (!code) return '';
    return code
      .toUpperCase()
      .split('')
      .map((c) => 127397 + c.charCodeAt(0))
      .map((cp) => String.fromCodePoint(cp))
      .join('');
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <TouchableOpacity onPress={() => setProfileVisible(true)} accessibilityRole="button" accessibilityLabel="Open profile">
            {avatarSource ? <Image source={avatarSource} style={styles.statusAvatar} /> : <View style={styles.statusAvatarPlaceholder} />}
          </TouchableOpacity>
          <View style={styles.statusTextWrap}>
            <View style={styles.nameRow}><Text style={styles.statusName}>{profile ? `${profile.firstName} ${profile.lastName}` : 'Your Sim'}</Text></View>
            <Text style={styles.statusMeta}>Age {age} • {countryCodeToFlag(profile?.country)}</Text>
          </View>
        </View>

        <View style={styles.statusRight}>
          <View style={styles.gameStat}><Text style={styles.gameStatIcon}>💰</Text><Text style={styles.gameStatText}>{moneyFormatter.format(money)}</Text></View>
          <TouchableOpacity style={styles.gameStat} onPress={() => setSettingsVisible(true)} accessibilityRole="button" accessibilityLabel="Settings">
            <MaterialCommunityIcons name="cog-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>{children}</View>

      {/* bottom nav: Home / Career / Relationships / Activities / More */}
      <View style={styles.bottomBar} onLayout={(e) => {
        try {
          const h = e.nativeEvent.layout.height;
          if (h && setNavHeight) setNavHeight(h);
        } catch (err) { }
      }}>
        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.navItem, currentGameTab === 'Home' && styles.navItemActive]} onPress={() => goToGameTab('Home')}>
            <MaterialCommunityIcons name="home-outline" size={22} color={currentGameTab === 'Home' ? '#2ecc71' : '#fff'} />
            <Text style={[styles.smallIconLabel, currentGameTab === 'Home' && styles.smallIconLabelActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navItem, currentGameTab === 'Career' && styles.navItemActive]} onPress={() => goToGameTab('Career')}>
            <MaterialCommunityIcons name="briefcase-outline" size={22} color={currentGameTab === 'Career' ? '#2ecc71' : '#fff'} />
            <Text style={[styles.smallIconLabel, currentGameTab === 'Career' && styles.smallIconLabelActive]}>Career</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navItem, currentGameTab === 'Relationships' && styles.navItemActive]} onPress={() => goToGameTab('Relationships')}>
            <MaterialCommunityIcons name="account-heart-outline" size={22} color={currentGameTab === 'Relationships' ? '#2ecc71' : '#fff'} />
            <Text style={[styles.smallIconLabel, currentGameTab === 'Relationships' && styles.smallIconLabelActive]}>Relationships</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navItem, currentGameTab === 'Activities' && styles.navItemActive]} onPress={() => { const setTab = useGameStore.getState().setCurrentGameTab; setTab && setTab('Activities'); navigation && navigation.navigate('Activities'); }}>
            <MaterialCommunityIcons name="flash-outline" size={22} color={currentGameTab === 'Activities' ? '#2ecc71' : '#fff'} />
            <Text style={[styles.smallIconLabel, currentGameTab === 'Activities' && styles.smallIconLabelActive]}>Activities</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navItem, currentGameTab === 'More' && styles.navItemActive]} onPress={() => { const setTab = useGameStore.getState().setCurrentGameTab; setTab && setTab('More'); navigation && navigation.navigate('More'); }}>
            <MaterialCommunityIcons name="dots-vertical" size={22} color={currentGameTab === 'More' ? '#2ecc71' : '#fff'} />
            <Text style={[styles.smallIconLabel, currentGameTab === 'More' && styles.smallIconLabelActive]}>More</Text>
          </TouchableOpacity>
    </View>
  </View>

      {/* Settings modal */}
      {/* Settings Modal - Modern Design */}
      <Modal visible={settingsVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.modalButton} onPress={async () => { await saveProfile(); setSettingsVisible(false); }}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.modalButtonText}>Save Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modalButton} onPress={async () => { await refreshSaves(); setLoadVisible(true); setSettingsVisible(false); }}>
            <MaterialCommunityIcons name="folder-open" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.modalButtonText}>Load Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalButton, { backgroundColor: '#ef4444' }]} 
            onPress={() => {
              Alert.alert('Start New Life', 'How would you like to start a new life?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Preserve current (save & start new)', onPress: async () => {
                  try {
                    await saveProfile();
                    await AsyncStorage.removeItem(NEW_CURRENT_KEY);
                    setCurrentSaveId(null);
                    const st = useGameStore.getState();
                    st.reset();
                    Toast.show({ type: 'success', text1: 'New life started', text2: 'Previous life preserved.', position: 'bottom' });
                    setSettingsVisible(false);
                    navigation && navigation.navigate('Home');
                  } catch (e) {
                    console.warn('start new preserve failed', e);
                    Alert.alert('Failed', 'Could not preserve and start new life.');
                  }
                } },
                { text: 'Reset current (clear everything)', style: 'destructive', onPress: async () => {
                  const st = useGameStore.getState();
                  st.reset();
                  await AsyncStorage.removeItem(NEW_CURRENT_KEY);
                  setCurrentSaveId(null);
                  Toast.show({ type: 'success', text1: 'New life started', position: 'bottom' });
                  setSettingsVisible(false);
                  navigation && navigation.navigate('Home');
                } }
              ]);
            }}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.modalButtonText}>Start New Life</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={() => setSettingsVisible(false)}>
            <Text style={[styles.modalButtonText, styles.modalCloseButtonText]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Profile modal */}
      <Modal visible={profileVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '92%', maxHeight: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {avatarSource ? <Image source={avatarSource} style={{ width: 72, height: 72, borderRadius: 12, marginRight: 12 }} /> : <View style={{ width: 72, height: 72, borderRadius: 12, backgroundColor: '#ddd', marginRight: 12 }} />}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '900', fontSize: 18 }}>{profile ? `${profile.firstName} ${profile.lastName ?? ''}` : 'Your Sim'}</Text>
                  <Text style={{ color: '#666' }}>{profile ? (profile.country ?? '') : ''}</Text>
                  <View style={{ height: 8 }} />
                  {/* two-column summary */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ color: '#666', fontSize: 12 }}>Gender</Text>
                      <Text style={{ fontWeight: '800' }}>{profile?.gender ? `${profile.gender.charAt(0).toUpperCase()}${profile.gender.slice(1)}` : 'Unknown'}</Text>
                    </View>
                    <View style={{ width: 90 }}>
                      <Text style={{ color: '#666', fontSize: 12 }}>Age</Text>
                      <Text style={{ fontWeight: '800' }}>{age}</Text>
                    </View>
                  </View>
                  <View style={{ height: 8 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ color: '#666', fontSize: 12 }}>Marital Status</Text>
                      <Text style={{ fontWeight: '800' }}>{profile?.partner ? 'Married/Partnered' : 'Single'}</Text>
                    </View>
                    <View style={{ width: 90 }}>
                      <Text style={{ color: '#666', fontSize: 12 }}>Education</Text>
                      <Text style={{ fontWeight: '800' }}>{(profile as any)?.education ?? 'Unknown'}</Text>
                    </View>
                  </View>
                  <View style={{ height: 8 }} />
                  <View>
                    <Text style={{ color: '#666', fontSize: 12 }}>Location</Text>
                    <Text style={{ fontWeight: '800' }}>{profile?.country ?? 'Unknown'}</Text>
                  </View>
                </View>
              </View>

              <View style={{ height: 20 }} />

              {/* Stats Section */}
              <View style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 12, marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' }}>Stats</Text>
                
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: '#374151', width: 100 }}>Happiness</Text>
                    <View style={{ flex: 1, height: 20, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden', marginHorizontal: 8 }}>
                      <View style={{ height: '100%', width: `${happiness ?? 0}%`, backgroundColor: '#fbbf24', borderRadius: 10 }} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', width: 45, textAlign: 'right' }}>{happiness ?? 0}%</Text>
                  </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: '#374151', width: 100 }}>Health</Text>
                    <View style={{ flex: 1, height: 20, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden', marginHorizontal: 8 }}>
                      <View style={{ height: '100%', width: `${health ?? 0}%`, backgroundColor: '#f87171', borderRadius: 10 }} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', width: 45, textAlign: 'right' }}>{health ?? 0}%</Text>
                  </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: '#374151', width: 100 }}>Smarts</Text>
                    <View style={{ flex: 1, height: 20, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden', marginHorizontal: 8 }}>
                      <View style={{ height: '100%', width: `${smarts ?? 0}%`, backgroundColor: '#60a5fa', borderRadius: 10 }} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', width: 45, textAlign: 'right' }}>{smarts ?? 0}%</Text>
                  </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: '#374151', width: 100 }}>Looks</Text>
                    <View style={{ flex: 1, height: 20, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden', marginHorizontal: 8 }}>
                      <View style={{ height: '100%', width: `${looks ?? 0}%`, backgroundColor: '#fb923c', borderRadius: 10 }} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', width: 45, textAlign: 'right' }}>{looks ?? 0}%</Text>
                  </View>
                </View>

                <View style={{ marginBottom: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: '#374151', width: 100 }}>Fame</Text>
                    <View style={{ flex: 1, height: 20, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden', marginHorizontal: 8 }}>
                      <View style={{ height: '100%', width: `${fame ?? 0}%`, backgroundColor: '#d1d5db', borderRadius: 10 }} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', width: 45, textAlign: 'right' }}>{fame ?? 0}%</Text>
                  </View>
                </View>
              </View>

              {/* Quick links moved from bottom nav: Assets & Skills */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <TouchableOpacity style={{ flex: 1, marginRight: 8, padding: 10, backgroundColor: '#e6f0ff', borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => { setProfileVisible(false); goToGameTab('Assets'); }}>
                  <MaterialCommunityIcons name="wallet-outline" size={18} color="#12323e" style={{ marginRight: 8 }} />
                  <Text style={{ fontWeight: '700' }}>Assets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, marginLeft: 8, padding: 10, backgroundColor: '#e6f0ff', borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => { setProfileVisible(false); goToGameTab('Skills'); }}>
                  <MaterialCommunityIcons name="brain" size={18} color="#12323e" style={{ marginRight: 8 }} />
                  <Text style={{ fontWeight: '700' }}>Skills</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <Button title="Close" onPress={() => setProfileVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Load Game Modal - Modern Design */}
      <Modal visible={loadVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Load Game</Text>
          
          <TouchableOpacity style={styles.modalButton} onPress={refreshSaves}>
            <MaterialCommunityIcons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.modalButtonText}>Refresh Saves</Text>
          </TouchableOpacity>
          
          <ScrollView style={styles.savesList}>
            {savedSlots.length === 0 ? (
              <Text style={styles.noSavesText}>No saved games found</Text>
            ) : (
              savedSlots.map((s) => {
                const avatar = resolveAvatar(s.profile) ?? characters[0];
                return (
                  <View key={s.id} style={styles.saveSlot}>
                    <View style={styles.saveSlotInfo}>
                      <Image source={avatar} style={styles.saveSlotAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.saveSlotName}>{s.name ?? `${s.profile?.firstName ?? 'Unknown'}`}</Text>
                        <Text style={styles.saveSlotMeta}>
                          Age {s.state?.age || 0} • {s.profile?.country || 'Unknown'}
                        </Text>
                        <Text style={styles.saveSlotDate}>
                          {new Date(s.createdAt).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.saveSlotButtons}>
                      <TouchableOpacity style={styles.loadButton} onPress={() => loadSlot(s)}>
                        <Text style={styles.loadButtonText}>Load</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSlot(s.id)}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
          
          <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={() => setLoadVisible(false)}>
            <Text style={[styles.modalButtonText, styles.modalCloseButtonText]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: { height: 84, backgroundColor: '#1f3b4d', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusLeft: { flexDirection: 'row', alignItems: 'center' },
  statusAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 10 },
  statusAvatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ccc', marginRight: 10 },
  statusTextWrap: { },
  statusName: { color: '#fff', fontWeight: '700' },
  statusMeta: { color: '#d0e6f2', fontSize: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  statusRight: { flexDirection: 'row', alignItems: 'center' },
  gameStat: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginLeft: 8, flexDirection: 'row', alignItems: 'center' },
  gameStatIcon: { color: '#fff', marginRight: 6 },
  gameStatText: { color: '#fff', fontWeight: '700' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, backgroundColor: '#12323e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, zIndex: 50 },
  navRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { /* subtle active state */ transform: [{ scale: 1.02 }] },
  smallIconLabelActive: { color: '#2ecc71' },
  smallIconLabel: { color: '#bcd7e6', fontSize: 11 },
  
  // Modern Modal Styles
  modalContent: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  modalTitle: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center', color: '#111827' },
  modalButton: { 
    backgroundColor: '#3b82f6', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalCloseButton: { backgroundColor: '#f3f4f6', marginTop: 12 },
  modalCloseButtonText: { color: '#374151' },
  savesList: { flex: 1, marginBottom: 16 },
  noSavesText: { textAlign: 'center', color: '#6b7280', fontSize: 16, marginTop: 20 },
  saveSlot: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#f9fafb', 
    borderRadius: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  saveSlotInfo: { flex: 1, marginRight: 12, flexDirection: 'row', alignItems: 'center' },
  saveSlotAvatar: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  saveSlotName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  saveSlotMeta: { fontSize: 14, color: '#6b7280', marginBottom: 2 },
  saveSlotDate: { fontSize: 12, color: '#9ca3af' },
  saveSlotButtons: { flexDirection: 'column', gap: 8 },
  loadButton: { 
    backgroundColor: '#10b981', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  loadButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  deleteButton: { 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  deleteButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
