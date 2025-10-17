import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useGameStore from '../store/gameStore';
import { JOBS, CAREER_PATHS } from '../constants/careers';
import { Job } from '../types/career';

interface FindJobScreenProps {
  navigation: any;
}

export default function FindJobScreen({ navigation }: FindJobScreenProps) {
  const {
    age,
    educationStatus,
    smarts,
    applyForJob,
  } = useGameStore();

  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Get all jobs for the selected path
  const allJobsInPath = selectedPath ? JOBS.filter(job => job.careerPath === selectedPath) : [];

  // Check if a job is eligible for the current player
  const isJobEligible = (job: Job) => {
    return (!job.requiredAge || age >= job.requiredAge) &&
           (!job.requiredEducation || educationStatus >= job.requiredEducation) &&
           (!job.requiredSmarts || smarts >= job.requiredSmarts);
  };

  // Get unmet requirements for a job
  const getUnmetRequirements = (job: Job) => {
    const unmet = [];
    if (job.requiredAge && age < job.requiredAge) {
      unmet.push(`Age ${job.requiredAge}+`);
    }
    if (job.requiredEducation && educationStatus < job.requiredEducation) {
      const educationLevels = ['Uneducated', 'Primary School', 'Secondary School', 'Trade Certificate', 'Associate Degree', 'Bachelor\'s Degree', 'Graduate Degree'];
      unmet.push(`${educationLevels[job.requiredEducation]} required`);
    }
    if (job.requiredSmarts && smarts < job.requiredSmarts) {
      unmet.push(`Smarts ${job.requiredSmarts}+`);
    }
    return unmet;
  };

  const handleApplyForJob = (job: Job) => {
    Alert.alert(
      'Apply for Job',
      `Apply for ${job.title}?\nSalary: $${job.baseSalary}/year\nRequirements: ${job.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: () => applyForJob(job) },
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back to Career</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Find a Job</Text>
      <Text style={styles.subtitle}>Full-time career positions</Text>

      {age < 18 ? (
        <View style={styles.lockedSection}>
          <Text style={styles.lockedText}>🔒 Full-time jobs are available at age 18</Text>
          <Text style={styles.lockedSubtext}>
            Try Freelance Gigs or Part-Time Jobs for younger workers!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsCard}>
            <Text style={styles.statsText}>
              Age: {age} | Education Level: {educationStatus} | Smarts: {smarts}
            </Text>
          </View>

      {!selectedPath ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Career Path:</Text>
          {Object.values(CAREER_PATHS).map(path => (
            <TouchableOpacity
              key={path}
              style={styles.pathButton}
              onPress={() => setSelectedPath(path)}
            >
              <Text style={styles.pathText}>{path}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPath(null)}
          >
            <Text style={styles.backText}>← Back to Career Paths</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>{selectedPath} Career Path:</Text>
          {allJobsInPath.map(job => {
            const eligible = isJobEligible(job);
            const unmetReqs = getUnmetRequirements(job);
            
            return (
              <TouchableOpacity
                key={job.id}
                style={[styles.jobOption, !eligible && styles.ineligibleJob]}
                onPress={() => eligible && handleApplyForJob(job)}
                disabled={!eligible}
              >
                <Text style={[styles.jobOptionTitle, !eligible && styles.ineligibleText]}>{job.title}</Text>
                <Text style={[styles.jobOptionDetail, !eligible && styles.ineligibleText]}>Salary: ${job.baseSalary}/year</Text>
                <Text style={[styles.jobOptionDetail, !eligible && styles.ineligibleText]}>Level: {job.level}</Text>
                <Text style={[styles.jobOptionDesc, !eligible && styles.ineligibleText]}>{job.description}</Text>
                {!eligible && unmetReqs.length > 0 && (
                  <Text style={styles.requirementsText}>Requirements: {unmetReqs.join(', ')}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
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
  pathButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  pathText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobOption: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  ineligibleJob: {
    backgroundColor: '#f5f5f5',
    borderLeftColor: '#ccc',
    opacity: 0.7,
  },
  jobOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ineligibleText: {
    color: '#999',
  },
  jobOptionDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobOptionDesc: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  requirementsText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginTop: 8,
    fontStyle: 'italic',
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