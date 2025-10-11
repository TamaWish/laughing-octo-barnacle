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

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
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
      <Modal visible={settingsVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 8 }}>Settings</Text>
            <Text style={{ color: '#666', marginBottom: 12 }}>Game settings and preferences will go here.</Text>
            <View style={{ marginBottom: 8 }}>
              <Button title="Save Profile" onPress={async () => { await saveProfile(); setSettingsVisible(false); }} />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Button title="Load Profile" onPress={async () => { await refreshSaves(); setLoadVisible(true); }} />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Button title="Start New Life" color="crimson" onPress={() => {
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
              }} />
            </View>
            <Button title="Close" onPress={() => setSettingsVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Profile modal */}
      <Modal visible={profileVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '92%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
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

            <View style={{ height: 12 }} />

            {/* side-by-side stat cards so Health sits closer to Happiness */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: '#f3f7fb', padding: 10, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Happiness</Text>
                <Text style={{ fontWeight: '900', fontSize: 18 }}>{happiness ?? 0}%</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#fff0f0', padding: 10, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>Health</Text>
                <Text style={{ fontWeight: '900', fontSize: 18 }}>{health ?? 0}%</Text>
              </View>
            </View>

            <View style={{ height: 12 }} />

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

            <Button title="Close" onPress={() => setProfileVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Load modal */}
      <Modal visible={loadVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '92%', backgroundColor: '#fff', borderRadius: 12, padding: 12, maxHeight: '80%' }}>
            <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 8 }}>Load Profile</Text>
            {savedSlots.length === 0 ? (
              <View style={{ alignItems: 'center' }}>
                <Text>No saved profiles found.</Text>
                <View style={{ height: 12 }} />
                <Button title="Refresh" onPress={refreshSaves} />
              </View>
            ) : (
              <ScrollView>
                {savedSlots.map((s) => {
                  const avatar = resolveAvatar(s.profile) ?? characters[0];
                  return (
                    <View key={s.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={avatar} style={{ width: 48, height: 48, borderRadius: 8 }} />
                        <View style={{ marginLeft: 12 }}>
                          <Text style={{ fontWeight: '700' }}>{s.name ?? `${s.profile?.firstName ?? 'Unknown'}`}</Text>
                          <Text style={{ color: '#666' }}>{s.profile?.country} • {new Date(s.createdAt).toLocaleString()}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => loadSlot(s)} style={{ padding: 8, marginRight: 8, backgroundColor: '#e6f0ff', borderRadius: 6 }}><Text>Load</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteSlot(s.id)} style={{ padding: 8 }}><Text style={{ color: 'crimson' }}>Delete</Text></TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
            <View style={{ height: 8 }} />
            <Button title="Close" onPress={() => setLoadVisible(false)} />
          </View>
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
});
