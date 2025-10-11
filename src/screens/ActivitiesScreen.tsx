import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, navigateToGame } from '../navigation';
import useGameStore from '../store/gameStore';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Activities'>;

const clamp = (v: number) => Math.max(0, Math.min(100, v));

function countryCodeToFlag(code?: string) {
  if (!code) return '';
  return code
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0))
    .map((cp) => String.fromCodePoint(cp))
    .join('');
}

export default function ActivitiesScreen({ navigation, route }: Props) {
  const { addEvent, age, money } = useGameStore.getState();
  const happiness = useGameStore((s) => s.happiness);
  const health = useGameStore((s) => s.health);
  const smarts = useGameStore((s) => s.smarts);
  const looks = useGameStore((s) => s.looks);
  const profile = useGameStore((s) => s.profile);
  // Shared UI (status bar, settings, profile, load) is provided by AppShell wrapper.
  const { width } = useWindowDimensions();
  const compact = width < 380;

  // ensure the shared currentGameTab reflects Activities when this screen is active
  React.useEffect(() => {
    const setTab = useGameStore.getState().setCurrentGameTab;
    setTab && setTab('Activities');
  }, []);

  const applyChanges = (delta: { money?: number; health?: number; happiness?: number; smarts?: number; looks?: number }, label: string) => {
    const st = useGameStore.getState();
    const next = {
      money: (st.money ?? 0) + (delta.money ?? 0),
      health: clamp((st.health ?? 0) + (delta.health ?? 0)),
      happiness: clamp((st.happiness ?? 0) + (delta.happiness ?? 0)),
      smarts: clamp((st.smarts ?? 0) + (delta.smarts ?? 0)),
      looks: clamp((st.looks ?? 0) + (delta.looks ?? 0)),
    } as any;
    const patch: any = {};
    if (typeof delta.money !== 'undefined') patch.money = next.money;
    if (typeof delta.health !== 'undefined') patch.health = next.health;
    if (typeof delta.happiness !== 'undefined') patch.happiness = next.happiness;
    if (typeof delta.smarts !== 'undefined') patch.smarts = next.smarts;
    if (typeof delta.looks !== 'undefined') patch.looks = next.looks;
    useGameStore.setState(patch);
    addEvent(label);
    Toast.show({ type: 'success', text1: label, position: 'bottom' });
  };

  const onPlasticSurgery = () => {
    const st = useGameStore.getState();
    const outcome = Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : -Math.floor(Math.random() * 20) - 5;
    const healthLoss = -10;
    useGameStore.setState({
      looks: clamp((st.looks ?? 50) + outcome),
      health: clamp((st.health ?? 50) + healthLoss),
      money: (st.money ?? 0) - 500,
    });
    addEvent(`Underwent plastic surgery. Looks ${outcome >= 0 ? `+${outcome}` : outcome}, Health ${healthLoss}.`);
    Toast.show({ type: outcome >= 0 ? 'success' : 'error', text1: 'Plastic Surgery', text2: outcome >= 0 ? `Looks +${outcome}` : `Looks ${outcome}` , position: 'bottom' });
  };

  // Expandable category component
  const Category = ({ id, title, items, expanded, onToggle }: { id: string; title: string; items: Array<{ icon?: string; name: string; desc?: string; action: () => void; badge?: string; _preview?: string }>; expanded: boolean; onToggle: () => void; }) => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} accessibilityRole="button">
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#6b7280" />
      </TouchableOpacity>

      {expanded && items.map((it, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.icon}>{it.icon ?? '🔹'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{it.name}</Text>
            {it.desc ? <Text style={styles.itemDesc}>{it.desc}</Text> : null}
            {it._preview ? <Text style={styles.itemPreview}>{it._preview}</Text> : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={it.action} accessibilityRole="button">
            <Text style={styles.buttonText}>{it.badge ?? 'Do'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // local selected nav item so bottom bar highlights Activities
  const [selectedNav, setSelectedNav] = React.useState<string>(route?.name ?? 'Activities');

  // persisted expand/collapse state from the store
  const expandedActivities = useGameStore((s) => s.expandedActivities);
  const setExpandedActivity = useGameStore((s) => s.setExpandedActivity);

  // Enable LayoutAnimation for Android (experimental flag)
  // LayoutAnimation is used below via LayoutAnimation.configureNext.
  // Historically we'd call UIManager.setLayoutAnimationEnabledExperimental(true) on Android,
  // but in the New Architecture that call is a no-op and emits a noisy warning. We rely on
  // try/catch around LayoutAnimation.configureNext instead and avoid calling the experimental API.

  // helper to toggle an expanded section with a small layout animation
  const toggleExpanded = (id: string, next?: boolean) => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (e) {
      // ignore if LayoutAnimation not supported
    }
    const cur = expandedActivities?.[id] ?? false;
    setExpandedActivity(id, typeof next === 'boolean' ? next : !cur);
  };

  // helper to compute a preview of the actual stat changes after clamps
  const computePreview = (delta?: { money?: number; health?: number; happiness?: number; smarts?: number; looks?: number; }): string | undefined => {
    if (!delta) return undefined;
    const st = useGameStore.getState();
    const parts: string[] = [];

    const addStat = (name: string, intended: number | undefined, before: number) => {
      if (typeof intended === 'undefined') return;
      const after = clamp(before + intended);
      const actual = after - before;
      // always show intended change; if clamp reduced it, show applied in parentheses
      const intendedStr = intended > 0 ? `+${intended}` : `${intended}`;
      if (actual !== intended) {
        // if nothing was applied and the stat was already at maximum, show friendlier message
        if (actual === 0 && before === 100 && intended > 0) {
          parts.push(`${name} ${intendedStr} (already at maximum)`);
        } else {
          const actualStr = actual > 0 ? `+${actual}` : `${actual}`;
          parts.push(`${name} ${intendedStr} (applied ${actualStr})`);
        }
      } else {
        // show intended when it actually applies (non-zero)
        if (intended !== 0) parts.push(`${name} ${intendedStr}`);
      }
    };

    addStat('Health', delta.health, st.health ?? 0);
    addStat('Happiness', delta.happiness, st.happiness ?? 0);
    addStat('Smarts', delta.smarts, st.smarts ?? 0);
    addStat('Looks', delta.looks, st.looks ?? 0);

    if (typeof delta.money !== 'undefined') {
      const intended = delta.money;
      parts.push(`Money ${intended > 0 ? `+$${intended}` : `-$${Math.abs(intended)}`}`);
    }

    return parts.length > 0 ? parts.join(' • ') : undefined;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Activities</Text>

        <Category
          id="education"
          title="1. Education & Smarts 🧠"
          expanded={!!expandedActivities?.education}
          onToggle={() => toggleExpanded('education')}
          items={[
            { icon: '📚', name: 'Read a Book', desc: 'A low-cost way to improve your Smarts stat.', action: () => applyChanges({ smarts: 8, happiness: 2 }, 'Read a book'), badge: 'Read', _preview: computePreview({ smarts: 8, happiness: 2 }) },
            { icon: '🎓', name: 'Take an Online Course', desc: 'Enroll in a certificate program or MOOC.', action: () => applyChanges({ smarts: 15, money: -120 }, 'Took an online course'), badge: 'Enroll', _preview: computePreview({ smarts: 15, money: -120 }) },
            { icon: '🗣️', name: 'Learn a New Language', desc: 'Dedicate time to master a second language.', action: () => applyChanges({ smarts: 10, happiness: 4 }, 'Practiced a language'), badge: 'Practice', _preview: computePreview({ smarts: 10, happiness: 4 }) },
            { icon: '📝', name: 'Study for an Exam', desc: 'Revise material to pass your course.', action: () => applyChanges({ smarts: 6 }, 'Studied for an exam'), badge: 'Study', _preview: computePreview({ smarts: 6 }) },
          ]}
        />

        <Category
          id="health"
          title="2. Health & Wellness ❤️"
          expanded={!!expandedActivities?.health}
          onToggle={() => toggleExpanded('health')}
          items={[
            { icon: '🧘', name: 'Do Yoga', desc: 'Clear your mind and improve flexibility.', action: () => applyChanges({ health: 6, happiness: 4 }, 'Did yoga'), badge: 'Do', _preview: computePreview({ health: 6, happiness: 4 }) },
            { icon: '🦷', name: 'Visit the Dentist', desc: 'Get a check-up to prevent future problems.', action: () => applyChanges({ health: 10, money: -80 }, 'Visited the dentist'), badge: 'Visit', _preview: computePreview({ health: 10, money: -80 }) },
            { icon: '🥗', name: 'Eat Healthy Meal', desc: 'Cook a nutritious meal.', action: () => applyChanges({ health: 4, money: -10 }, 'Ate a healthy meal'), badge: 'Cook', _preview: computePreview({ health: 4, money: -10 }) },
            { icon: '🧖', name: 'Go to a Spa', desc: "Treat yourself to a day of relaxation.", action: () => applyChanges({ happiness: 18, money: -150 }, 'Went to a spa'), badge: 'Relax', _preview: computePreview({ happiness: 18, money: -150 }) },
          ]}
        />

        <Category
          id="looks"
          title="3. Looks & Appearance ✨"
          expanded={!!expandedActivities?.looks}
          onToggle={() => toggleExpanded('looks')}
          items={[
            { icon: '💇', name: 'Get a Haircut', desc: 'A simple change to boost your looks.', action: () => applyChanges({ looks: 6, money: -20 }, 'Got a haircut'), badge: 'Cut', _preview: computePreview({ looks: 6, money: -20 }) },
            { icon: '🛍️', name: 'Go Shopping', desc: 'Buy new clothes to refresh your wardrobe.', action: () => applyChanges({ looks: 12, money: -80 }, 'Went shopping'), badge: 'Buy', _preview: computePreview({ looks: 12, money: -80 }) },
            { icon: '🩺', name: 'Plastic Surgery', desc: 'High-risk, high-reward transformation.', action: onPlasticSurgery, badge: 'Risk', _preview: 'Looks: random (+10..+40 or -6..-25). Health -10. Money -$500' },
            { icon: '💄', name: 'Apply Makeup', desc: 'Enhance your natural beauty.', action: () => applyChanges({ looks: 4 }, 'Applied makeup'), badge: 'Apply', _preview: computePreview({ looks: 4 }) },
          ]}
        />

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },
  // header/status bar styles (copied from GameScreen)
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

  scrollContent: { padding: 16, paddingBottom: 140 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f2f4' },
  icon: { fontSize: 22, width: 36 },
  itemTitle: { fontWeight: '700' },
  itemDesc: { color: '#6b7280', fontSize: 13 },
  itemPreview: { color: '#93a3ad', fontSize: 12, marginTop: 4 },
  button: { backgroundColor: '#2ecc71', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, backgroundColor: '#12323e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  navRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { /* subtle background or scale could be added */ },
  smallIconLabelActive: { color: '#2ecc71' },
  smallIconLabel: { color: '#bcd7e6', fontSize: 11 },
});
