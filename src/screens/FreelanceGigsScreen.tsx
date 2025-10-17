import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useGameStore from '../store/gameStore';

interface FreelanceGigsScreenProps {
  navigation: any;
}

interface Gig {
  id: string;
  title: string;
  description: string;
  payRange: string;
  timeRequired: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skills: string[];
}

const FREELANCE_GIGS: Gig[] = [
  {
    id: 'social-media-post',
    title: 'Social Media Content Creation',
    description: 'Create engaging social media posts for a local business',
    payRange: '$50-100',
    timeRequired: '2-4 hours',
    difficulty: 'Easy',
    skills: ['Creativity'],
  },
  {
    id: 'logo-design',
    title: 'Simple Logo Design',
    description: 'Design a logo for a small business startup',
    payRange: '$150-300',
    timeRequired: '4-8 hours',
    difficulty: 'Medium',
    skills: ['Design', 'Creativity'],
  },
  {
    id: 'data-entry',
    title: 'Data Entry Task',
    description: 'Enter data from scanned documents into spreadsheets',
    payRange: '$30-60',
    timeRequired: '3-6 hours',
    difficulty: 'Easy',
    skills: ['Attention to Detail'],
  },
  {
    id: 'web-bug-fix',
    title: 'Website Bug Fix',
    description: 'Fix minor bugs on a small business website',
    payRange: '$100-200',
    timeRequired: '2-5 hours',
    difficulty: 'Medium',
    skills: ['Programming', 'Problem Solving'],
  },
  {
    id: 'content-writing',
    title: 'Blog Post Writing',
    description: 'Write a 1000-word blog post on a given topic',
    payRange: '$75-150',
    timeRequired: '4-6 hours',
    difficulty: 'Medium',
    skills: ['Writing', 'Research'],
  },
  {
    id: 'virtual-assistant',
    title: 'Virtual Assistant Tasks',
    description: 'Handle email management and scheduling for a busy professional',
    payRange: '$40-80',
    timeRequired: '3-5 hours',
    difficulty: 'Easy',
    skills: ['Organization', 'Communication'],
  },
  {
    id: 'graphic-design',
    title: 'Business Card Design',
    description: 'Design professional business cards for a company',
    payRange: '$80-160',
    timeRequired: '2-4 hours',
    difficulty: 'Medium',
    skills: ['Design', 'Creativity'],
  },
  {
    id: 'translation',
    title: 'Document Translation',
    description: 'Translate business documents from one language to another',
    payRange: '$60-120',
    timeRequired: '3-6 hours',
    difficulty: 'Medium',
    skills: ['Language Skills'],
  },
];

export default function FreelanceGigsScreen({ navigation }: FreelanceGigsScreenProps) {
  const { age, smarts, money, happiness, addEvent } = useGameStore();

  const availableGigs = FREELANCE_GIGS.filter(gig => {
    // Filter based on skills/difficulty
    if (gig.difficulty === 'Hard' && smarts < 80) return false;
    if (gig.difficulty === 'Medium' && smarts < 60) return false;
    return true;
  });

  const handleTakeGig = (gig: Gig) => {
    Alert.alert(
      'Accept Gig',
      `Accept "${gig.title}"?\nPay: ${gig.payRange}\nTime: ${gig.timeRequired}\nDifficulty: ${gig.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            // Simulate taking the gig - earn random amount in pay range
            const payRange = gig.payRange.replace('$', '').split('-');
            const minPay = parseInt(payRange[0]);
            const maxPay = parseInt(payRange[1]);
            const earned = Math.floor(Math.random() * (maxPay - minPay + 1)) + minPay;

            // Update money and happiness
            const newMoney = money + earned;
            const newHappiness = Math.max(0, Math.min(100, happiness - 1)); // Small happiness decrease for working

            useGameStore.setState({
              money: newMoney,
              happiness: newHappiness,
            });

            addEvent(`Completed freelance gig "${gig.title}" and earned $${earned}. Happiness -1.`);

            Alert.alert('Gig Completed!', `You earned $${earned} from "${gig.title}"`);
          }
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Career</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Freelance Gigs</Text>
      <Text style={styles.subtitle}>Quick money opportunities (Age 15+)</Text>

      {age < 15 ? (
        <View style={styles.lockedSection}>
          <Text style={styles.lockedText}>🔒 Freelance gigs are available at age 15</Text>
          <Text style={styles.lockedSubtext}>
            Keep learning and growing until then!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsCard}>
            <Text style={styles.statsText}>Available gigs based on your skills (Smarts: {smarts})</Text>
          </View>

          <View style={styles.gigsList}>
        {availableGigs.map(gig => (
          <TouchableOpacity
            key={gig.id}
            style={styles.gigCard}
            onPress={() => handleTakeGig(gig)}
          >
            <View style={styles.gigHeader}>
              <Text style={styles.gigTitle}>{gig.title}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(gig.difficulty) }]}>
                <Text style={styles.difficultyText}>{gig.difficulty}</Text>
              </View>
            </View>

            <Text style={styles.gigDescription}>{gig.description}</Text>

            <View style={styles.gigDetails}>
              <Text style={styles.detailText}>💰 {gig.payRange}</Text>
              <Text style={styles.detailText}>⏱️ {gig.timeRequired}</Text>
            </View>

            <View style={styles.skillsContainer}>
              {gig.skills.map(skill => (
                <View key={skill} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  gigsList: {
    paddingBottom: 20,
  },
  gigCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gigHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gigTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gigDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  gigDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockedSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 32,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  lockedSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});