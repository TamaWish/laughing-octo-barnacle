import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Enrollment } from '../store/types/education';

interface EnrollmentHistoryItem {
  enrollment: Enrollment;
  completionDate: string;
}

interface EnrollmentHistoryProps {
  history: EnrollmentHistoryItem[];
}

export default function EnrollmentHistory({ history }: EnrollmentHistoryProps) {
  if (!history || history.length === 0) {
    return null;
  }

  // Sort by completion date (most recent first)
  const sortedHistory = [...history].sort((a, b) =>
    new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Education History</Text>
      {sortedHistory.map((item, index) => {
        const completionYear = new Date(item.completionDate).getFullYear();
        const courseName = item.enrollment.major
          ? `${item.enrollment.name} (${item.enrollment.major})`
          : item.enrollment.name;

        return (
          <View key={`${item.enrollment.id}-${index}`} style={styles.historyItem}>
            <Text style={styles.courseName}>{courseName}</Text>
            <Text style={styles.completionDate}>Completed {completionYear}</Text>
            {item.enrollment.currentGPA && (
              <Text style={styles.gpaText}>Final GPA: {item.enrollment.currentGPA.toFixed(2)}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  courseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  completionDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  gpaText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});