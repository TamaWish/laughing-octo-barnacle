import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, LayoutAnimation, Modal, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import useGameStore from '../store/gameStore';
// Import the new country map and helper function
import { getEducationCatalog, getCountryMeta } from '../store/educationCatalog';
import { formatCurrency } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'Education'>;

export default function EducationScreen({ navigation, route }: Props) {
  const profile = useGameStore((s) => s.profile);
  const { width } = useWindowDimensions();
  const compact = width < 380;
  // AppShell provides the header/profile/settings/load UI and autosave; EducationScreen now focuses on content only.

  // --- NEW LOGIC: Select the appropriate catalog based on country ---
  const countryCode = profile?.country || 'US';
  const { categories, courses, config } = getEducationCatalog(countryCode);
  const countryMeta = getCountryMeta(countryCode);
  const options = categories; // Use the country-specific categories
  const expandedActivities = useGameStore((s) => s.expandedActivities);
  const setExpandedActivity = useGameStore((s) => s.setExpandedActivity);
  const enrollCourse = useGameStore((s) => s.enrollCourse);
  const completedDegrees = useGameStore((s) => s.completedDegrees);
  const completedCertificates = useGameStore((s) => s.completedCertificates);
  const educationStatus = useGameStore((s) => s.educationStatus);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<any | null>(null);

  // Helper function to check if a course is completed
  const isCourseCompleted = (course: any) => {
    return completedDegrees?.includes(course.name) || completedCertificates?.includes(course.id);
  };

  // Helper function to check if prerequisites are met
  const arePrerequisitesMet = (course: any) => {
    // Check education status requirement
    if (typeof course.requiredStatus === 'number' && educationStatus < course.requiredStatus) {
      return false;
    }
    // Check age requirement
    if (typeof course.requiredAge === 'number' && useGameStore.getState().age < course.requiredAge) {
      return false;
    }
    // Check skill prerequisites
    if (course.preReqs && course.preReqs.requiredSkill) {
      const skill = course.preReqs.requiredSkill;
      const required = course.preReqs.value || 0;
      const currentValue = (useGameStore.getState() as any)[skill] || 0;
      if (currentValue < required) {
        return false;
      }
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
    <Text style={styles.title}>{`Education in ${countryMeta.name}`}</Text>
    <View style={styles.countryBadge}>
      <Text style={styles.countryBadgeText}>
        {countryMeta.flag}  {config.countryName} — {config.kindergartenName}, {config.primaryName}, {config.secondaryName}
      </Text>
    </View>

        <View style={styles.cardList}>
          {options.map((o) => (
            <View key={o.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>🎓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{o.title}</Text>
                <Text style={styles.cardDesc}>{o.desc}</Text>
                {expandedActivities?.[o.id] ? (
                  <View style={{ marginTop: 10 }}>
                    {/* Use the country-specific courses map */}
                    {courses[o.id]?.map((course: any) => {
                      const completed = isCourseCompleted(course);
                      const prereqsMet = arePrerequisitesMet(course);
                      const canEnroll = !completed && prereqsMet;
                      
                      return (
                        <View key={course.id} style={[styles.courseRow, completed && styles.completedCourseRow]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.courseName, completed && styles.completedText]}>{course.name} <Text style={[styles.courseType, completed && styles.completedText]}>[{course.type}]</Text></Text>
                            <Text style={[styles.courseDesc, completed && styles.completedText]}>{course.description}</Text>
                            <Text style={[styles.courseMeta, completed && styles.completedText]}>
                              Duration: {course.duration} yr • Cost: {formatCurrency(course.cost)}
                              {course.requiredStatus !== undefined ? ` • Req Status: ${course.requiredStatus}` : ''}
                              {course.requiredAge !== undefined ? ` • Req Age: ${course.requiredAge}` : ''}
                            </Text>
                            {completed && <Text style={styles.completedLabel}>✓ Completed</Text>}
                            {!prereqsMet && !completed && <Text style={styles.prereqLabel}>Prerequisites not met</Text>}
                          </View>
                          <TouchableOpacity 
                            style={[styles.enrollButton, (!canEnroll) && styles.disabledButton]} 
                            onPress={() => canEnroll && setSelectedCourse(course)}
                            disabled={!canEnroll}
                          >
                            <Text style={[styles.enrollText, (!canEnroll) && styles.disabledText]}>
                              {completed ? 'Completed' : 'Enroll'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.cardAction}
                onPress={() => {
                  try { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); } catch (e) {}
                  setExpandedActivity(o.id, !expandedActivities?.[o.id]);
                }}
              >
                <Text style={styles.cardActionText}>{expandedActivities?.[o.id] ? 'Collapse' : 'View'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
        <Modal visible={confirmVisible} animationType="slide" transparent>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: '92%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
              <Text style={{ fontWeight: '900', fontSize: 18, marginBottom: 8 }}>Confirm Enrollment</Text>
              {selectedCourse ? (
                <View>
                  <Text style={{ fontWeight: '800' }}>{selectedCourse.name}</Text>
                  <Text style={{ color: '#666', marginTop: 6 }}>{selectedCourse.description}</Text>
                  <Text style={{ color: '#666', marginTop: 8 }}>Duration: {selectedCourse.duration} years</Text>
                  <Text style={{ color: '#666' }}>Cost: {formatCurrency(selectedCourse.cost)}</Text>
                  <View style={{ height: 12 }} />
                  <Button title="Confirm" onPress={() => { enrollCourse(selectedCourse); setConfirmVisible(false); setSelectedCourse(null); }} />
                  <View style={{ height: 8 }} />
                  <Button title="Cancel" color="#666" onPress={() => { setConfirmVisible(false); setSelectedCourse(null); }} />
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </ScrollView>
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
  gameStat: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginLeft: 8, flexDirection: 'row', alignItems: 'center' },
  gameStatIcon: { color: '#fff', marginRight: 6 },
  gameStatText: { color: '#fff', fontWeight: '700' },

  scrollContent: { padding: 12, paddingBottom: 140 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  countryBadge: { backgroundColor: '#e6f0ff', padding: 8, borderRadius: 8, marginBottom: 16, alignSelf: 'flex-start' },
  countryBadgeText: { color: '#2b8cff', fontWeight: '600', fontSize: 14 },
  cardList: { },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, elevation: 2 },
  cardLeft: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eef6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardDesc: { color: '#6b7280', fontSize: 13 },
  cardAction: { backgroundColor: '#2b8cff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 12 },
  cardActionText: { color: '#fff', fontWeight: '700' },

  // course list styles
  courseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f2f4' },
  completedCourseRow: { opacity: 0.6 },
  courseName: { fontWeight: '800' },
  courseType: { fontWeight: '600', color: '#6b7280', fontSize: 12 },
  courseDesc: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  courseMeta: { color: '#93a3ad', fontSize: 12, marginTop: 4 },
  completedText: { color: '#888', textDecorationLine: 'line-through' },
  completedLabel: { color: '#28a745', fontSize: 12, fontWeight: '600', marginTop: 4 },
  prereqLabel: { color: '#dc3545', fontSize: 12, fontWeight: '600', marginTop: 4 },
  enrollButton: { backgroundColor: '#2b8cff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 12 },
  disabledButton: { backgroundColor: '#ccc' },
  enrollText: { color: '#fff', fontWeight: '700' },
  disabledText: { color: '#666' },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, backgroundColor: '#12323e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  navRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { /* subtle background or scale could be added */ },
  smallIconLabelActive: { color: '#2ecc71' },
  smallIconLabel: { color: '#bcd7e6', fontSize: 11 },
});
