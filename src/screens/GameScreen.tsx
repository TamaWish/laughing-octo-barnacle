import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TabKey } from '../navigation';
import useGameStore from '../store/gameStore';
import Toast from 'react-native-toast-message';
import EventLog from '../components/EventLog';
import ActionCard from '../components/ActionCard';
import SkillsPanel from '../components/SkillsPanel';
import AssetsScreen from './AssetsScreen';
import CareerScreen from './CareerScreen';
import EducationInfo from '../components/EducationInfo';
import ActionButtons from '../components/ActionButtons';
import { Profile } from '../types/profile';
import { characters, resolveAvatar } from '../constants/characters';

const FIRST_NAMES = ['Alex','Sam','Taylor','Jordan','Casey','Riley','Jamie','Morgan','Charlie','Avery','Quinn','Dakota','Parker','Rowan','Sydney','Elliot'];

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

function countryCodeToFlag(code?: string) {
  if (!code) return '';
  // Convert ISO country code (e.g. 'US') to emoji flag
  return code
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0))
    .map((cp) => String.fromCodePoint(cp))
    .join('');
}

export default function GameScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const navHeight = useGameStore((s) => s.navHeight);
  const { age, money, advanceYear, reset } = useGameStore();
  // Subscribe to education state for reactive updates
  const isCurrentlyEnrolled = useGameStore((s) => s.isCurrentlyEnrolled);
  const currentEnrollment = useGameStore((s) => s.currentEnrollment);
  const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const { width, height: windowHeight } = useWindowDimensions();
  const compact = width < 380;
  // local selected nav item (used for active-state highlighting)
  // default selected tab can be passed via navigation param initialTab
  const initialTab = (route?.params as any)?.initialTab as TabKey | undefined;
  const storeCurrentTab = useGameStore((s) => s.currentGameTab);
  const [selectedNav, setSelectedNav] = React.useState<TabKey>(initialTab ?? storeCurrentTab ?? 'Home');
  // keep the central store in sync so AppShell can read the active tab
  React.useEffect(() => {
    const setTab = useGameStore.getState().setCurrentGameTab;
    setTab && setTab(selectedNav);
  }, [selectedNav]);

  // listen for external tab changes (AppShell sets store when bottom nav is pressed)
  React.useEffect(() => {
    if (storeCurrentTab && storeCurrentTab !== selectedNav) {
      setSelectedNav(storeCurrentTab);
    }
  }, [storeCurrentTab]);
  // prefer store profile, fallback to navigation param
  const storeProfile: Profile | undefined = useGameStore((s) => s.profile);
  const paramProfile = route?.params?.profile as Profile | undefined;
  const profile = storeProfile ?? paramProfile;

  const avatarSource = profile ? resolveAvatar(profile) : undefined;

  // local state to force regeneration of suggestions
  const [suggestSeed, setSuggestSeed] = React.useState(0);

  // Padding for scroll view (bottom nav only, no stats card anymore)
  const computedPaddingBottom = insets.bottom + (navHeight || 86);

  // debug logging removed for production

  type Suggestion = {
    id: string;
    icon?: string;
    title: string;
    desc: string;
    primary: string;
    secondary?: string;
    onPrimary?: () => void;
    onSecondary?: () => void;
  };

  const completed = useGameStore((s) => s.completedSuggestions);

  const markCompleted = useGameStore((s) => s.markSuggestionCompleted);

  const [disabledIds, setDisabledIds] = React.useState<string[]>([]);

  // Settings modal state
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [loadVisible, setLoadVisible] = React.useState(false);
  const [savedSlots, setSavedSlots] = React.useState<any[]>([]);
  const [currentSaveId, setCurrentSaveId] = React.useState<string | null>(null);

  const NEW_KEY = 'simslyfe-saves';
  const NEW_CURRENT_KEY = 'simslyfe-current';

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
      setSettingsVisible(false);
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

  // Initialize save system
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

  // Setup autosave
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

  // generate a small set of random suggestions based on store state
  const suggestions: Suggestion[] = React.useMemo(() => {
    // helper to randomize
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const templates: Array<Partial<Suggestion>> = [
      { icon: '🩺', title: 'Visit the Doctor', desc: 'Your health could use a check-up.', primary: 'Go Now', secondary: 'Ignore' },
      { icon: '💼', title: 'Take a Part-time Job', desc: 'Earn some extra cash.', primary: 'Take Job', secondary: 'Pass' },
      { icon: '📈', title: 'Invest in Stocks', desc: 'High risk, high reward.', primary: 'Invest', secondary: 'Skip' },
      { icon: '💘', title: 'Plan a Date', desc: 'Your relationship needs attention.', primary: 'Suggest Date', secondary: 'Ignore' },
      { icon: '🏋️', title: 'Go to the Gym', desc: 'A quick workout will help.', primary: 'Go Now', secondary: 'Later' },
      { icon: '📝', title: 'Apply for Promotion', desc: 'You may qualify for a higher role.', primary: 'Apply', secondary: 'Wait' },
    ];

    // pick 3 random distinct templates
    const picks: Partial<Suggestion>[] = [];
    const pool = [...templates];
    while (picks.length < 3 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      picks.push(pool.splice(i, 1)[0]);
    }

    // materialize suggestions with actions that touch the store
    const materialized = picks.map((p, idx) => {
      const id = `sugg-${Date.now()}-${idx}-${suggestSeed}`;
      const base: Suggestion = {
        id,
        icon: p.icon,
        title: p.title || 'Action',
        desc: p.desc || '',
        primary: p.primary || 'Do',
        secondary: p.secondary,
      };

      base.onPrimary = () => {
        if (disabledIds.includes(id)) return;
        setDisabledIds((d) => [...d, id]);
        // call store actions
        const st = useGameStore.getState();
        if (base.title === 'Visit the Doctor') st.visitDoctor();
        else if (base.title === 'Take a Part-time Job') navigation.navigate('PartTimeJobs');
        else if (base.title === 'Invest in Stocks') st.investStocks();
        else if (base.title === 'Plan a Date') st.planDate();
        else if (base.title === 'Go to the Gym') st.goToGym();
        else if (base.title === 'Apply for Promotion') st.applyForPromotion();
        markCompleted(id);
        Toast.show({ type: 'success', text1: `${base.title} done`, position: 'bottom' });
        setTimeout(() => setDisabledIds((d) => d.filter((x) => x !== id)), 1200);
      };

      base.onSecondary = () => {
        const st = useGameStore.getState();
        st.ignoreSuggestion(base.title);
        markCompleted(id);
        Toast.show({ type: 'info', text1: `Ignored: ${base.title}`, position: 'bottom' });
      };

      return base;
    });

    return materialized.filter((s) => !completed.includes(s.id));
  }, [age, money, suggestSeed, completed, disabledIds]);

  const BottomActionBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.navRow}>
  <TouchableOpacity style={[styles.navItem, selectedNav === 'Home' && styles.navItemActive]} onPress={() => { setSelectedNav('Home'); }} accessibilityRole="button" accessibilityLabel="Home">
          <MaterialCommunityIcons name="home-outline" size={22} color={selectedNav === 'Home' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Home' && styles.smallIconLabelActive]}>Home</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Career' && styles.navItemActive, age < 18 && styles.navItemDisabled]} accessibilityRole="button" accessibilityLabel="Career" onPress={() => { if (age >= 18) { setSelectedNav('Career'); } else { Toast.show({ type: 'error', text1: 'Locked', text2: 'You must be 18 to access full-time career options.' }); } }}>
          <MaterialCommunityIcons name="briefcase-outline" size={22} color={(selectedNav === 'Career' && age >= 18) ? '#2ecc71' : (age < 18 ? '#999' : '#fff')} />
          {!compact && <Text style={[styles.smallIconLabel, (selectedNav === 'Career' && age >= 18) && styles.smallIconLabelActive, age < 18 && { color: '#999' }]}>Career</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Assets' && styles.navItemActive, age < 18 && styles.navItemDisabled]} accessibilityRole="button" accessibilityLabel="Assets" onPress={() => { if (age >= 18) { setSelectedNav('Assets'); } else { Toast.show({ type: 'error', text1: 'Locked', text2: 'You must be 18 to access assets.' }); } }}>
          <MaterialCommunityIcons name="wallet-outline" size={22} color={(selectedNav === 'Assets' && age >= 18) ? '#2ecc71' : (age < 18 ? '#999' : '#fff')} />
          {!compact && <Text style={[styles.smallIconLabel, (selectedNav === 'Assets' && age >= 18) && styles.smallIconLabelActive, age < 18 && { color: '#999' }]}>Assets</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Skills' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Skills" onPress={() => { setSelectedNav('Skills'); }}>
          <MaterialCommunityIcons name="brain" size={22} color={selectedNav === 'Skills' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Skills' && styles.smallIconLabelActive]}>Skills</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Relationships' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Relationships" onPress={() => { setSelectedNav('Relationships'); navigation.navigate('Relationships'); }}>
          <MaterialCommunityIcons name="account-heart-outline" size={22} color={selectedNav === 'Relationships' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Relationships' && styles.smallIconLabelActive]}>Relationships</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Activities' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Activities" onPress={() => { setSelectedNav('Activities'); navigation.navigate('Activities'); }}>
          <MaterialCommunityIcons name="flash-outline" size={22} color={selectedNav === 'Activities' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Activities' && styles.smallIconLabelActive]}>Activities</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'More' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="More" onPress={() => { setSelectedNav('More'); }}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color={selectedNav === 'More' ? '#2ecc71' : '#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: computedPaddingBottom }]}>
        {/* Detailed profile card - Education and Actions */}
        <View style={styles.profileCard}>
          {/* Show education info if enrolled and age 3+ */}
          {age >= 3 && isCurrentlyEnrolled && currentEnrollment && (() => {
            const enrollment = currentEnrollment;
            if (!enrollment) return null;
            
            const progress = enrollment.duration > 0 
              ? ((enrollment.duration - (enrollment.timeRemaining ?? enrollment.duration)) / enrollment.duration) * 100 
              : 0;
            
            const graduationYear = new Date().getFullYear() + Math.ceil(enrollment.timeRemaining ?? enrollment.duration ?? 0);
            
            return (
              <EducationInfo
                schoolName={enrollment.name}
                yearsRemaining={Math.ceil(enrollment.timeRemaining ?? enrollment.duration ?? 0)}
                progress={Math.round(progress)}
                graduationDate={`${graduationYear}`}
              />
            );
          })()}
          
          <ActionButtons
            onAdvanceYear={advanceYear}
            onEducation={() => navigation.navigate('Education')}
          />
        </View>

        {(() => {
          switch (selectedNav) {
            case 'Skills':
              return <SkillsPanel />;
            case 'Assets':
              return <AssetsScreen />;
            case 'Career':
              return <CareerScreen navigation={navigation} />;
            case 'Home':
            default:
              return (
                <>
                  <View style={styles.actionsRow}>
                    <Text style={styles.sectionTitle}>What's Next? Action Bar</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 12, paddingRight: 20, marginTop: 8 }}
              >
                {suggestions.map((s) => (
                  <ActionCard key={s.id} icon={s.icon} title={s.title} desc={s.desc} primary={s.primary} secondary={s.secondary} onPrimary={s.onPrimary} onSecondary={s.onSecondary} />
                ))}
              </ScrollView>
              <TouchableOpacity style={{ position: 'absolute', right: 12, top: -6 }} onPress={() => setSuggestSeed((v) => v + 1)}>
                <Text style={{ color: '#6b7280' }}>Shuffle</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.logSection}>
              <Text style={styles.sectionTitle}>Log</Text>
              {/* compute a responsive height so the log fills ~55% of the screen */}
              {(() => {
                const cardHeight = Math.round(windowHeight * 0.55);
                // inner EventLog should be slightly smaller than the card to allow for padding/header
                const innerMax = Math.max(120, cardHeight - 40);
                return (
                  <View style={[styles.logCard, { height: cardHeight }]}>
                    <EventLog maxHeight={innerMax} />
                  </View>
                );
              })()}
            </View>
          </>
        );
    }
        })()}

  {/* spacer removed; paddingBottom handles safe spacing above the bottom nav */}
      </ScrollView>

      {/* Stats removed - now shown in Profile modal via AppShell */}

      {/* Settings Modal */}
      <Modal visible={settingsVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity style={styles.modalButton} onPress={saveProfile}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.modalButtonText}>Save Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => { setLoadVisible(true); setSettingsVisible(false); }}>
            <MaterialCommunityIcons name="folder-open" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.modalButtonText}>Load Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={() => setSettingsVisible(false)}>
            <Text style={[styles.modalButtonText, styles.modalCloseButtonText]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Load Game Modal */}
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
              savedSlots.map((slot: any) => (
                <View key={slot.id} style={styles.saveSlot}>
                  <View style={styles.saveSlotInfo}>
                    <Text style={styles.saveSlotName}>{slot.name}</Text>
                    {slot.profile && (
                      <Text style={styles.saveSlotMeta}>
                        {slot.profile.firstName} - Age {slot.state?.age || 0}
                      </Text>
                    )}
                  </View>
                  <View style={styles.saveSlotButtons}>
                    <TouchableOpacity style={styles.loadButton} onPress={() => loadProfile(slot)}>
                      <Text style={styles.loadButtonText}>Load</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProfile(slot.id)}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
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
  container: { flex: 1, backgroundColor: '#f2f4f7' },
  profileCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statusBar: { height: 84, backgroundColor: '#1f3b4d', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusLeft: { flexDirection: 'row', alignItems: 'center' },
  statusAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 10 },
  statusAvatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ccc', marginRight: 10 },
  statusTextWrap: { },
  statusName: { color: '#fff', fontWeight: '700' },
  statusMeta: { color: '#d0e6f2', fontSize: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  statusRight: { flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: '#ffeaa7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  badgeText: { fontWeight: '700' },
  smallBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#2b6b87', marginLeft: 6 },
  gameStat: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginLeft: 8, flexDirection: 'row', alignItems: 'center' },
  gameStatIcon: { color: '#fff', marginRight: 6 },
  gameStatText: { color: '#fff', fontWeight: '700' },

  scrollContent: { padding: 12, paddingBottom: 12 },
  actionsRow: { marginTop: 12 },
  sectionTitle: { fontWeight: '700' },
  toast: { position: 'absolute', left: '50%', transform: [{ translateX: -100 }], bottom: 160, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  toastText: { color: '#fff' },

  logSection: { marginTop: 14 },
  logCard: { marginTop: 8, backgroundColor: '#fff', borderRadius: 10, padding: 10, minHeight: 120, maxHeight: 620, overflow: 'hidden' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, backgroundColor: '#12323e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  bottomLeftIcons: { flexDirection: 'row', alignItems: 'center' },
  bottomRightIcons: { flexDirection: 'row', alignItems: 'center' },
  navRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { /* subtle background or scale could be added */ },
  navItemDisabled: { opacity: 0.5 },
  smallIconLabelActive: { color: '#2ecc71' },
  smallIcon: { alignItems: 'center', marginRight: 8 },
  smallIconText: { fontSize: 18, color: '#fff' },
  smallIconLabel: { color: '#bcd7e6', fontSize: 11 },
  ageButton: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#2ecc71', alignItems: 'center', justifyContent: 'center', marginBottom: 22, alignSelf: 'center' },
  agePlus: { fontSize: 36, color: '#fff', fontWeight: '700' },
  ageLabel: { color: '#fff', fontSize: 12 },
  advanceButton: { backgroundColor: '#2ecc71', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 28, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  advanceLabel: { color: '#fff', fontWeight: '700' },
  moreIcon: { marginLeft: 8, padding: 8 },
  bottomCenterSpacer: { width: 140 },
  
  // Modal styles
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
  saveSlotInfo: { flex: 1, marginRight: 12 },
  saveSlotName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  saveSlotMeta: { fontSize: 14, color: '#6b7280' },
  saveSlotButtons: { flexDirection: 'row', gap: 8 },
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
