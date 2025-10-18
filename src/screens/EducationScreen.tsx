import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, LayoutAnimation, Modal, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import useGameStore from '../store/gameStore';
// Import the new country map and helper function
import { getEducationCatalog, getCountryMeta, UNIVERSITY_MAJORS } from '../store/educationCatalog';
import { formatCurrency } from '../utils/formatters';
import { UniversityMajor } from '../store/types/education';

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
  const completedUniversityCourses = useGameStore((s) => s.completedUniversityCourses);
  const educationStatus = useGameStore((s) => s.educationStatus);
  const isCurrentlyEnrolled = useGameStore((s) => s.isCurrentlyEnrolled);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<any | null>(null);
  
  // University-specific state
  const [selectedMajor, setSelectedMajor] = React.useState<UniversityMajor | null>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<'loan' | 'parents' | 'cash' | null>(null);
  const [showMajorSelection, setShowMajorSelection] = React.useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = React.useState(false);

  // Helper function to check if a course is completed
  // For university courses with majors, we DON'T mark the whole course as completed
  // We only mark individual majors as completed in the major selection modal
  const isCourseCompleted = (course: any) => {
    // For university courses with majors, never mark the whole course as completed
    const isUniversityCourse = course.id?.includes('-university-') || course.id?.includes('-uni-');
    if (isUniversityCourse && course.majors && course.majors.length > 0) {
      return false; // Allow enrollment - major selection will show which majors are completed
    }
    return completedDegrees?.includes(course.name) || 
           completedCertificates?.includes(course.id) ||
           completedUniversityCourses?.includes(course.id);
  };

  // Helper function to check if a specific major in a course is completed
  const isMajorCompleted = (courseId: string, majorId: string) => {
    const courseKey = `${courseId}-${majorId}`;
    return completedUniversityCourses?.includes(courseKey);
  };

  // Helper function to check if prerequisites are met
  const arePrerequisitesMet = (course: any) => {
    // Check education status requirement
    if (typeof course.requiredStatus === 'number' && educationStatus < course.requiredStatus) {
      return false;
    }
    // Check minimum age requirement
    if (typeof course.requiredAge === 'number' && useGameStore.getState().age < course.requiredAge) {
      return false;
    }
    // Check maximum age requirement (for kindergarten, primary, secondary)
    if (typeof course.maxAge === 'number' && useGameStore.getState().age > course.maxAge) {
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
                      const isEnrolledInThisCourse = isCurrentlyEnrolled && useGameStore.getState().currentEnrollment?.id === course.id;
                      const isEnrolledInDifferentCourse = isCurrentlyEnrolled && useGameStore.getState().currentEnrollment?.id !== course.id;
                      const isUniversityCourse = course.id?.includes('-university-') || course.id?.includes('-uni-');
                      
                      // For university courses, allow re-enrollment in different courses but not completed ones
                      const canEnroll = !completed && prereqsMet && (!isCurrentlyEnrolled || (isUniversityCourse && !isEnrolledInThisCourse));
                      const isGreyedOut = completed || !prereqsMet || (isEnrolledInDifferentCourse && !isUniversityCourse);
                      
                      return (
                        <View key={course.id} style={[styles.courseRow, isGreyedOut && styles.completedCourseRow]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.courseName, isGreyedOut && styles.completedText]}>{course.name} <Text style={[styles.courseType, isGreyedOut && styles.completedText]}>[{course.type}]</Text></Text>
                            <Text style={[styles.courseDesc, isGreyedOut && styles.completedText]}>{course.description}</Text>
                            <Text style={[styles.courseMeta, isGreyedOut && styles.completedText]}>
                              Duration: {course.duration} yr • Cost: {formatCurrency(course.cost)}
                              {course.requiredStatus !== undefined ? ` • Req Status: ${course.requiredStatus}` : ''}
                              {course.requiredAge !== undefined ? ` • Req Age: ${course.requiredAge}` : ''}
                              {course.preReqs?.requiredSkill ? ` • Req ${course.preReqs.requiredSkill}: ${course.preReqs.value}+` : ''}
                            </Text>
                            {completed && <Text style={styles.completedLabel}>✓ Completed</Text>}
                            {isEnrolledInThisCourse && <Text style={styles.enrolledLabel}>Currently Enrolled</Text>}
                            {isEnrolledInDifferentCourse && isUniversityCourse && <Text style={styles.prereqLabel}>Enrolled in different university program</Text>}
                            {isEnrolledInDifferentCourse && !isUniversityCourse && <Text style={styles.prereqLabel}>Already enrolled in another course</Text>}
                            {!prereqsMet && !completed && !isCurrentlyEnrolled && <Text style={styles.prereqLabel}>Prerequisites not met</Text>}
                          </View>
                          <TouchableOpacity 
                            style={[styles.enrollButton, (!canEnroll) && styles.disabledButton]} 
                            onPress={() => {
                              if (canEnroll) {
                                setSelectedCourse(course);
                                // Check if this is a university course
                                if (o.id === 'university' && course.majors && course.majors.length > 0) {
                                  setShowMajorSelection(true);
                                  setSelectedMajor(null);
                                  setSelectedPayment(null);
                                } else {
                                  setConfirmVisible(true);
                                }
                              }
                            }}
                            disabled={!canEnroll}
                          >
                            <Text style={[styles.enrollText, (!canEnroll) && styles.disabledText]}>
                              {completed ? 'Completed' : 
                               isEnrolledInThisCourse ? 'Enrolled' :
                               (isEnrolledInDifferentCourse && isUniversityCourse) ? 'Switch' :
                               isEnrolledInDifferentCourse ? 'Enrolled' :
                               !prereqsMet ? 'Locked' :
                               'Enroll'}
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
        
        {/* Major Selection Modal (Step 1 for Universities) */}
        <Modal visible={showMajorSelection} animationType="slide" transparent>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View style={{ width: '92%', maxHeight: '80%', backgroundColor: '#1a1a2e', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#e94560' }}>
              <Text style={{ fontWeight: '900', fontSize: 22, marginBottom: 4, color: '#fff', textAlign: 'center' }}>
                🏛️ {selectedCourse?.name}
              </Text>
              <Text style={{ fontSize: 16, color: '#4ec9ff', fontWeight: '700', textAlign: 'center', marginBottom: 16 }}>
                Apply to university today!
              </Text>
              
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 12 }}>
                Pick your major:
              </Text>
              
              <ScrollView style={{ maxHeight: 400 }}>
                {selectedCourse?.majors?.map((major: UniversityMajor) => {
                  const isCompleted = isMajorCompleted(selectedCourse.id, major.id);
                  return (
                  <TouchableOpacity
                    key={major.id}
                    style={[
                      styles.majorOption,
                      selectedMajor?.id === major.id && styles.majorOptionSelected,
                      isCompleted && styles.majorOptionCompleted
                    ]}
                    onPress={() => {
                      if (!isCompleted) {
                        setSelectedMajor(major);
                      }
                    }}
                    disabled={isCompleted}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.majorName, selectedMajor?.id === major.id && styles.majorNameSelected, isCompleted && styles.majorNameCompleted]}>
                        {major.name}
                      </Text>
                      <Text style={[styles.majorDesc, isCompleted && styles.majorDescCompleted]}>{major.description}</Text>
                      {isCompleted && <Text style={styles.completedLabel}>✓ Completed</Text>}
                    </View>
                    {selectedMajor?.id === major.id && !isCompleted && (
                      <Text style={{ fontSize: 24 }}>✓</Text>
                    )}
                    {isCompleted && (
                      <Text style={{ fontSize: 16, color: '#999', fontWeight: '600' }}>Completed</Text>
                    )}
                  </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <View style={{ height: 16 }} />
              <TouchableOpacity
                style={[styles.nextButton, !selectedMajor && styles.disabledNextButton]}
                onPress={() => {
                  if (selectedMajor) {
                    setShowMajorSelection(false);
                    setShowPaymentSelection(true);
                  }
                }}
                disabled={!selectedMajor}
              >
                <Text style={styles.nextButtonText}>Next: Choose Payment →</Text>
              </TouchableOpacity>
              
              <View style={{ height: 8 }} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowMajorSelection(false);
                  setSelectedCourse(null);
                  setSelectedMajor(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Payment Selection Modal (Step 2 for Universities) */}
        <Modal visible={showPaymentSelection} animationType="slide" transparent>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View style={{ width: '92%', backgroundColor: '#1a1a2e', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#e94560' }}>
              <Text style={{ fontWeight: '900', fontSize: 20, marginBottom: 4, color: '#fff' }}>
                {selectedCourse?.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 16 }}>
                Major: {selectedMajor?.name}
              </Text>
              
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 12 }}>
                How will you pay for your university program?
              </Text>
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#4ec9ff', fontWeight: '700', fontSize: 16 }}>
                  Annual Tuition: {formatCurrency(selectedCourse?.cost || 0)}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 14 }}>
                  Years: {selectedCourse?.duration}
                </Text>
                <Text style={{ color: '#ff6b6b', fontWeight: '800', fontSize: 18, marginTop: 4 }}>
                  Total Cost: {formatCurrency((selectedCourse?.cost || 0) * (selectedCourse?.duration || 1))}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.paymentOption, selectedPayment === 'loan' && styles.paymentOptionSelected]}
                onPress={() => setSelectedPayment('loan')}
              >
                <Text style={styles.paymentTitle}>💰 Apply for a student loan</Text>
                <Text style={styles.paymentDesc}>Borrow money to pay for tuition. Repay after graduation.</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.paymentOption, selectedPayment === 'parents' && styles.paymentOptionSelected]}
                onPress={() => setSelectedPayment('parents')}
              >
                <Text style={styles.paymentTitle}>👨‍👩‍👧 Ask my parents to pay</Text>
                <Text style={styles.paymentDesc}>Request financial support from your parents.</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.paymentOption, selectedPayment === 'cash' && styles.paymentOptionSelected]}
                onPress={() => setSelectedPayment('cash')}
              >
                <Text style={styles.paymentTitle}>💵 Pay with cash</Text>
                <Text style={styles.paymentDesc}>Use your own savings to pay tuition upfront.</Text>
              </TouchableOpacity>
              
              <View style={{ height: 16 }} />
              <TouchableOpacity
                style={[styles.nextButton, !selectedPayment && styles.disabledNextButton]}
                onPress={() => {
                  if (selectedPayment && selectedMajor) {
                    // Enroll with major and payment method
                    enrollCourse({
                      ...selectedCourse,
                      major: selectedMajor.id,
                      paymentMethod: selectedPayment
                    });
                    setShowPaymentSelection(false);
                    setSelectedCourse(null);
                    setSelectedMajor(null);
                    setSelectedPayment(null);
                  }
                }}
                disabled={!selectedPayment}
              >
                <Text style={styles.nextButtonText}>Confirm Enrollment</Text>
              </TouchableOpacity>
              
              <View style={{ height: 8 }} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPaymentSelection(false);
                  setShowMajorSelection(true);
                }}
              >
                <Text style={styles.cancelButtonText}>← Back to Majors</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Regular Enrollment Confirmation Modal (for non-university courses) */}
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
  completedText: { color: '#999', textDecorationLine: 'line-through' },
  completedLabel: { color: '#28a745', fontSize: 12, fontWeight: '600', marginTop: 4 },
  enrolledLabel: { color: '#ffa500', fontSize: 12, fontWeight: '600', marginTop: 4 },
  prereqLabel: { color: '#dc3545', fontSize: 12, fontWeight: '600', marginTop: 4 },
  enrollButton: { backgroundColor: '#2b8cff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 12 },
  disabledButton: { backgroundColor: '#d3d3d3' },
  enrollText: { color: '#fff', fontWeight: '700' },
  disabledText: { color: '#666' },

  // University major selection styles
  majorOption: {
    backgroundColor: '#2a2a40',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3a3a50',
    flexDirection: 'row',
    alignItems: 'center',
  },
  majorOptionSelected: {
    borderColor: '#4ec9ff',
    backgroundColor: '#1e3a5f',
  },
  majorOptionCompleted: {
    backgroundColor: '#2a2a35',
    borderColor: '#444',
    opacity: 0.6,
  },
  majorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  majorNameSelected: {
    color: '#4ec9ff',
  },
  majorNameCompleted: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  majorDesc: {
    fontSize: 13,
    color: '#aaa',
  },
  majorDescCompleted: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  nextButton: {
    backgroundColor: '#4ec9ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledNextButton: {
    backgroundColor: '#555',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Payment selection styles
  paymentOption: {
    backgroundColor: '#2a2a40',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3a3a50',
  },
  paymentOptionSelected: {
    borderColor: '#4ec9ff',
    backgroundColor: '#1e3a5f',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  paymentDesc: {
    fontSize: 13,
    color: '#aaa',
  },

  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 86, backgroundColor: '#12323e', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  navRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { /* subtle background or scale could be added */ },
  smallIconLabelActive: { color: '#2ecc71' },
  smallIconLabel: { color: '#bcd7e6', fontSize: 11 },
});
