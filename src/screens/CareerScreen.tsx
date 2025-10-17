import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import useGameStore from '../store/gameStore';
import { Job } from '../types/career';

interface CareerScreenProps {
  navigation: any;
}

export default function CareerScreen({ navigation }: CareerScreenProps) {
  const {
    career,
    work,
    quitJob,
    applyForPromotion,
    workPartTime,
    quitPartTimeJob,
    age,
  } = useGameStore();

  const canApplyForPromotion = career?.currentJob && career.workExperience >= 50;

  const handleWork = () => {
    work();
  };

  const handleQuitJob = () => {
    Alert.alert(
      'Quit Job',
      'Are you sure you want to quit your job?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', onPress: quitJob },
      ]
    );
  };

  const handlePromotion = () => {
    applyForPromotion();
  };

  const handleFindJob = () => {
    navigation.navigate('FindJob');
  };

  const handleFreelanceGigs = () => {
    navigation.navigate('FreelanceGigs');
  };

  const handlePartTimeJobs = () => {
    navigation.navigate('PartTimeJobs');
  };

  const handleWorkPartTime = () => {
    if (!career?.partTimeJob) return;
    
    const maxHours = career.partTimeJob.hoursPerWeek;
    const currentHours = career.partTimeHoursWorked;
    const remainingHours = maxHours - currentHours;
    
    if (remainingHours <= 0) {
      Alert.alert('Cannot Work', 'You have already worked the maximum hours for this week.');
      return;
    }

    // For simplicity, let them work remaining hours or ask for hours
    const buttons = [
      { text: 'Cancel', style: 'cancel' as const },
      {
        text: 'Work All Remaining',
        onPress: () => workPartTime(remainingHours),
      },
    ];

    if (remainingHours >= 4) {
      buttons.push({
        text: 'Work 4 Hours',
        onPress: () => workPartTime(4),
      });
    }

    if (remainingHours >= 2) {
      buttons.push({
        text: 'Work 2 Hours',
        onPress: () => workPartTime(2),
      });
    }

    Alert.alert(
      'Work Part-Time',
      `How many hours do you want to work? (Max: ${remainingHours})`,
      buttons
    );
  };

  const handleQuitPartTimeJob = () => {
    Alert.alert(
      'Quit Part-Time Job',
      'Are you sure you want to quit your part-time job?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', onPress: quitPartTimeJob },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Career</Text>

      {/* Current Job Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Job</Text>
        {career?.currentJob ? (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{career.currentJob.title}</Text>
            <Text style={styles.jobDetail}>Salary: ${career.currentJob.baseSalary}/year</Text>
            <Text style={styles.jobDetail}>Career Path: {career.currentJob.careerPath}</Text>
            <Text style={styles.jobDetail}>Work Experience: {career.workExperience} points</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.workButton} onPress={handleWork}>
                <Text style={styles.buttonText}>Work</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quitButton} onPress={handleQuitJob}>
                <Text style={styles.buttonText}>Quit Job</Text>
              </TouchableOpacity>
            </View>
            {canApplyForPromotion && (
              <TouchableOpacity style={styles.promotionButton} onPress={handlePromotion}>
                <Text style={styles.buttonText}>Apply for Promotion</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.noJobText}>No current job</Text>
        )}
      </View>

      {/* Part-Time Job Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Part-Time Job</Text>
        {career?.partTimeJob ? (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{career.partTimeJob.title}</Text>
            <Text style={styles.jobDetail}>Company: {career.partTimeJob.company}</Text>
            <Text style={styles.jobDetail}>Hourly Rate: ${career.partTimeJob.hourlyRate}</Text>
            <Text style={styles.jobDetail}>Hours Worked: {career.partTimeHoursWorked}/{career.partTimeJob.hoursPerWeek} per week</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.workButton, career.partTimeHoursWorked >= career.partTimeJob.hoursPerWeek && styles.disabledButton]} 
                onPress={handleWorkPartTime}
                disabled={career.partTimeHoursWorked >= career.partTimeJob.hoursPerWeek}
              >
                <Text style={styles.buttonText}>Work Part-Time</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quitButton} onPress={handleQuitPartTimeJob}>
                <Text style={styles.buttonText}>Quit Part-Time Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.noJobText}>No part-time job</Text>
        )}
      </View>

      {/* Career History */}
      {career?.careerHistory && career.careerHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career History</Text>
          {career.careerHistory.map((job: Job, index: number) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>{job.title} - {job.careerPath}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Job Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Opportunities</Text>
        <TouchableOpacity 
          style={[styles.optionButton, age < 18 && styles.optionButtonDisabled]} 
          onPress={handleFindJob}
          disabled={age < 18}
        >
          <Text style={[styles.optionButtonText, age < 18 && styles.disabledButtonText]}>Find a Job</Text>
          <Text style={[styles.optionDescription, age < 18 && styles.disabledButtonText]}>
            {age < 18 ? 'Available at age 18 - Browse full-time career positions' : 'Browse full-time career positions'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handleFreelanceGigs}>
          <Text style={styles.optionButtonText}>Freelance Gigs</Text>
          <Text style={styles.optionDescription}>Quick money opportunities (Available at age 15+)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handlePartTimeJobs}>
          <Text style={styles.optionButtonText}>Part-Time Jobs</Text>
          <Text style={styles.optionDescription}>Browse hourly job listings (Available at age 15+)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  jobCard: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 4,
  },
  jobDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  workButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  quitButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
  },
  promotionButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noJobText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#555',
  },
  optionButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  optionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  disabledButtonText: {
    color: '#999',
  },
  optionDescription: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
});