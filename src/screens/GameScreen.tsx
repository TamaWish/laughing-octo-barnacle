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
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TabKey } from '../navigation';
import useGameStore from '../store/gameStore';
import Toast from 'react-native-toast-message';
import EventLog from '../components/EventLog';
import RelationshipsPanel from '../components/RelationshipsPanel';
import StatBar from '../components/StatBar';
import ActionCard from '../components/ActionCard';
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
  const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  // dynamic stats (0-100)
  const happiness = useGameStore((s) => s.happiness);
  const health = useGameStore((s) => s.health);
  const smarts = useGameStore((s) => s.smarts);
  const looks = useGameStore((s) => s.looks);
  const fame = useGameStore((s) => s.fame);
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

  // measure the stats card height so we can pad the ScrollView to scroll under it
  const [statsHeight, setStatsHeight] = React.useState<number>(0);
  // debug: compute spacing values and optionally show overlay in dev
  const computedPaddingBottom = insets.bottom + (navHeight || 86) + (statsHeight || 0);
  const statsBottomOffset = insets.bottom + (navHeight || 86);

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
  const [statsExpanded, setStatsExpanded] = React.useState<boolean>(true);

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
        else if (base.title === 'Take a Part-time Job') st.takePartTimeJob();
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

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Career' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Career" onPress={() => { setSelectedNav('Career'); }}>
          <MaterialCommunityIcons name="briefcase-outline" size={22} color={selectedNav === 'Career' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Career' && styles.smallIconLabelActive]}>Career</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Assets' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Assets" onPress={() => { setSelectedNav('Assets'); }}>
          <MaterialCommunityIcons name="wallet-outline" size={22} color={selectedNav === 'Assets' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Assets' && styles.smallIconLabelActive]}>Assets</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Skills' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Skills" onPress={() => { setSelectedNav('Skills'); }}>
          <MaterialCommunityIcons name="brain" size={22} color={selectedNav === 'Skills' ? '#2ecc71' : '#fff'} />
          {!compact && <Text style={[styles.smallIconLabel, selectedNav === 'Skills' && styles.smallIconLabelActive]}>Skills</Text>}
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, selectedNav === 'Relationships' && styles.navItemActive]} accessibilityRole="button" accessibilityLabel="Relationships" onPress={() => { setSelectedNav('Relationships'); }}>
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
        <View style={styles.banner}>
          <LinearGradient colors={["#f7fbff", "#e6f0fb"]} style={styles.bannerBackground} />
          {avatarSource ? (
            // keep image slightly zoomed but offset so it doesn't dominate
            <Image source={avatarSource} style={styles.bannerImage} resizeMode="cover" />
          ) : (
            <View style={styles.bannerPlaceholder} />
          )}
          <View style={styles.inBannerLeft}><Text style={styles.goalRibbonText}>GOAL: SAVE FOR A HOUSE</Text></View>
          <View style={styles.inBannerRight}><Text style={styles.bannerMoneyText}>{moneyFormatter.format(money)}</Text></View>
        </View>

        {/* Advance Year pill placed below the banner and above the actions */}
        <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 8 + insets.bottom, flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          <TouchableOpacity style={styles.advancePillInline} onPress={advanceYear} accessibilityRole="button" accessibilityLabel="Advance year">
            <MaterialCommunityIcons name="calendar-arrow-right" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.advanceLabel}>Advance Year</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.advancePillInline, { backgroundColor: '#2b8cff' }]} onPress={() => navigation.navigate('Education')} accessibilityRole="button" accessibilityLabel="Education">
            <MaterialCommunityIcons name="school" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.advanceLabel}>Education</Text>
          </TouchableOpacity>
        </View>

        {selectedNav === 'Relationships' ? (
          <RelationshipsPanel />
        ) : (
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
        )}

  {/* spacer removed; paddingBottom handles safe spacing above the bottom nav */}
      </ScrollView>

        <View
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h !== statsHeight) setStatsHeight(h);
          }}
          style={[
            styles.statsCard,
            statsExpanded ? styles.statsCardExpanded : [styles.statsCardCollapsed, styles.statsCardCollapsedExtraPad],
            // position the stats card just above the app bottom nav using the measured navHeight
            { bottom: statsBottomOffset },
          ]}
        >
        <View style={styles.statsHeaderRow}>
          <Text style={styles.statsHeaderTitle}>Stats</Text>
          <TouchableOpacity onPress={() => setStatsExpanded((s) => !s)} style={styles.statsToggle}>
            <Text style={styles.statsToggleText}>{statsExpanded ? 'Collapse' : 'Expand'}</Text>
          </TouchableOpacity>
        </View>
        {statsExpanded ? (
          <>
            <StatBar label="Happiness" value={happiness ?? 0} color="#f6c85f" />
            <StatBar label="Health" value={health ?? 0} color="#ff6b6b" />
            <StatBar label="Smarts" value={smarts ?? 0} color="#6be3ff" />
            <StatBar label="Looks" value={looks ?? 0} color="#ff8a65" />
            <StatBar label="Fame" value={fame ?? 0} color="#ffcc00" />
          </>
        ) : (
          <View style={styles.statsCompactRow}>
            <View style={styles.statsCompactItem}>
              <Text style={styles.statsCompactLabel}>Happiness</Text>
              <Text style={styles.statsCompactValue}>{happiness ?? 0}%</Text>
            </View>
            <View style={styles.statsCompactItem}>
              <Text style={styles.statsCompactLabel}>Health</Text>
              <Text style={styles.statsCompactValue}>{health ?? 0}%</Text>
            </View>
            <View style={styles.statsCompactItem}>
              <Text style={styles.statsCompactLabel}>Smarts</Text>
              <Text style={styles.statsCompactValue}>{smarts ?? 0}%</Text>
            </View>
            <View style={styles.statsCompactItem}>
              <Text style={styles.statsCompactLabel}>Looks</Text>
              <Text style={styles.statsCompactValue}>{looks ?? 0}%</Text>
            </View>
            <View style={styles.statsCompactItem}>
              <Text style={styles.statsCompactLabel}>Fame</Text>
              <Text style={styles.statsCompactValue}>{fame ?? 0}%</Text>
            </View>
          </View>
        )}
  </View>
      {/* debug overlay removed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },
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
  banner: { height: 150, backgroundColor: '#e6eef6', borderRadius: 12, overflow: 'hidden', justifyContent: 'center' },
  bannerBackground: { ...StyleSheet.absoluteFillObject },
  bannerImage: { width: '120%', height: '120%', position: 'absolute', right: -30, bottom: -10 },
  bannerPlaceholder: { flex: 1, backgroundColor: '#cfdce6' },
  goalPill: { position: 'absolute', left: 12, top: 12, backgroundColor: '#ffc107', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, elevation: 2 },
  goalText: { fontWeight: '700', fontSize: 12 },
  // New ribbon under the banner
  goalRibbon: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#ffc107', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  goalRibbonText: { fontWeight: '800' },
  // banner internal overlays
  inBannerLeft: { position: 'absolute', left: 12, bottom: 12, backgroundColor: '#ffc107', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  inBannerRight: { position: 'absolute', right: 12, bottom: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  moneyBubble: { position: 'absolute', right: 12, bottom: 16, backgroundColor: '#4b5563', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, elevation: 3 },
  bannerMoneyText: { color: '#fff', fontWeight: '700' },

  actionsRow: { marginTop: 12 },
  sectionTitle: { fontWeight: '700' },
  toast: { position: 'absolute', left: '50%', transform: [{ translateX: -100 }], bottom: 160, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  toastText: { color: '#fff' },

  logSection: { marginTop: 14 },
  logCard: { marginTop: 8, backgroundColor: '#fff', borderRadius: 10, padding: 10, minHeight: 120, maxHeight: 620, overflow: 'hidden' },

  statsCard: { position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 12, zIndex: 100, elevation: 10 },
  statsCardExpanded: { paddingBottom: 16 },
  statsCardCollapsed: { paddingVertical: 8 },
  statsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statsHeaderTitle: { fontWeight: '700' },
  statsToggle: { paddingHorizontal: 8, paddingVertical: 4 },
  statsToggleText: { color: '#2b8cff', fontWeight: '700' },
  statsCompactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statsCompactItem: { alignItems: 'center', flex: 1, paddingHorizontal: 6 },
  statsCompactLabel: { color: '#6b7280', fontSize: 12, textAlign: 'center' },
  statsCompactValue: { fontWeight: '800', fontSize: 18, marginTop: 4, textAlign: 'center' },
  // give extra bottom padding so the big age button doesn't overlap collapsed values
  statsCardCollapsedExtraPad: { paddingBottom: 36 },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, backgroundColor: '#12323e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  bottomLeftIcons: { flexDirection: 'row', alignItems: 'center' },
  bottomRightIcons: { flexDirection: 'row', alignItems: 'center' },
  navRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { /* subtle background or scale could be added */ },
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
  advancePillInline: { backgroundColor: '#2ecc71', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  bottomCenterSpacer: { width: 140 },
});
