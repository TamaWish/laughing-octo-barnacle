import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useGameStore from '../store/gameStore';
import { PartTimeJob } from '../types/career';

interface PartTimeJobsScreenProps {
  navigation: any;
}

const PART_TIME_JOBS: PartTimeJob[] = [
  {
    id: 'retail-assistant',
    title: 'Retail Sales Assistant',
    company: 'Local Mall Store',
    description: 'Help customers find products and process sales transactions',
    hourlyRate: 15,
    hoursPerWeek: 20,
    duration: 'Ongoing',
    requirements: ['Customer service skills', 'Age 16+'],
    location: 'Downtown Mall',
  },
  {
    id: 'barista',
    title: 'Barista',
    company: 'Coffee Corner',
    description: 'Prepare and serve coffee drinks, maintain cafe cleanliness',
    hourlyRate: 14,
    hoursPerWeek: 25,
    duration: 'Ongoing',
    requirements: ['Food service experience preferred', 'Age 16+'],
    location: 'Main Street',
  },
  {
    id: 'tutor',
    title: 'Math Tutor',
    company: 'Learning Center',
    description: 'Provide one-on-one math tutoring to high school students',
    hourlyRate: 25,
    hoursPerWeek: 15,
    duration: '3-6 months',
    requirements: ['Strong math skills', 'Teaching experience preferred'],
    location: 'Education District',
  },
  {
    id: 'delivery-driver',
    title: 'Delivery Driver',
    company: 'Quick Delivery Co.',
    description: 'Deliver packages and food orders around the city',
    hourlyRate: 18,
    hoursPerWeek: 30,
    duration: 'Ongoing',
    requirements: ['Valid driver\'s license', 'Age 18+', 'Navigation skills'],
    location: 'City-wide',
  },
  {
    id: 'warehouse-helper',
    title: 'Warehouse Helper',
    company: 'Storage Solutions',
    description: 'Assist with inventory management and order fulfillment',
    hourlyRate: 16,
    hoursPerWeek: 20,
    duration: 'Temporary (2 months)',
    requirements: ['Physical stamina', 'Attention to detail', 'Age 16+'],
    location: 'Industrial Park',
  },
  {
    id: 'receptionist',
    title: 'Office Receptionist',
    company: 'Business Center',
    description: 'Greet visitors, answer phones, and handle administrative tasks',
    hourlyRate: 17,
    hoursPerWeek: 25,
    duration: '3 months',
    requirements: ['Communication skills', 'Basic computer skills', 'Age 16+'],
    location: 'Business District',
  },
  {
    id: 'pet-sitter',
    title: 'Pet Sitter',
    company: 'Paw Care Services',
    description: 'Visit homes to feed and care for pets while owners are away',
    hourlyRate: 12,
    hoursPerWeek: 10,
    duration: 'Flexible',
    requirements: ['Love for animals', 'Reliable transportation', 'Age 16+'],
    location: 'Various locations',
  },
  {
    id: 'event-helper',
    title: 'Event Setup Helper',
    company: 'Event Masters',
    description: 'Help set up and break down equipment for various events',
    hourlyRate: 13,
    hoursPerWeek: 15,
    duration: 'Event-based',
    requirements: ['Physical fitness', 'Team player', 'Age 16+'],
    location: 'Convention Center',
  },
];

export default function PartTimeJobsScreen({ navigation }: PartTimeJobsScreenProps) {
  const { age, money, happiness, addEvent, career, applyForPartTimeJob } = useGameStore();

  const availableJobs = PART_TIME_JOBS.filter(job => {
    // Basic age requirement check
    return !job.requirements.some(req => req.includes('Age 18+') && age < 18);
  });

  const handleApplyForJob = (job: PartTimeJob) => {
    Alert.alert(
      'Apply for Part-Time Job',
      `Apply for ${job.title} at ${job.company}?\nHourly Rate: $${job.hourlyRate}\nHours/Week: ${job.hoursPerWeek}\nDuration: ${job.duration}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            applyForPartTimeJob(job);
            navigation.goBack();
          }
        },
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

      <Text style={styles.title}>Part-Time Jobs</Text>
      <Text style={styles.subtitle}>Browse hourly job listings (Age 15+)</Text>

      {age < 15 ? (
        <View style={styles.lockedSection}>
          <Text style={styles.lockedText}>🔒 Part-time jobs are available at age 15</Text>
          <Text style={styles.lockedSubtext}>
            Keep learning and growing until then!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsCard}>
            <Text style={styles.statsText}>Available part-time jobs (Age: {age})</Text>
            {career.partTimeJob && (
              <Text style={styles.currentJobText}>
                Current part-time job: {career.partTimeJob.title} at {career.partTimeJob.company}
                {'\n'}Hours worked this week: {career.partTimeHoursWorked}/{career.partTimeJob.hoursPerWeek}
              </Text>
            )}
          </View>

          <View style={styles.jobsList}>
        {availableJobs.map(job => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => handleApplyForJob(job)}
          >
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyText}>{job.company}</Text>
            </View>

            <Text style={styles.jobDescription}>{job.description}</Text>

            <View style={styles.jobDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💰 Hourly Rate:</Text>
                <Text style={styles.detailValue}>${job.hourlyRate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>⏱️ Hours/Week:</Text>
                <Text style={styles.detailValue}>{job.hoursPerWeek}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 Duration:</Text>
                <Text style={styles.detailValue}>{job.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 Location:</Text>
                <Text style={styles.detailValue}>{job.location}</Text>
              </View>
            </View>

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              {job.requirements.map((req, index) => (
                <Text key={index} style={styles.requirementText}>• {req}</Text>
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
  currentJobText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  jobsList: {
    paddingBottom: 20,
  },
  jobCard: {
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
  jobHeader: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  companyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  requirementsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
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