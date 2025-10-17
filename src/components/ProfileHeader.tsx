import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ProfileHeaderProps {
  avatarSource?: ImageSourcePropType;
  name: string;
  age: number;
  countryCode?: string;
  onSettingsPress?: () => void;
}

function countryCodeToFlag(code?: string) {
  if (!code) return '';
  return code
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0))
    .map((cp) => String.fromCodePoint(cp))
    .join('');
}

export default function ProfileHeader({ 
  avatarSource, 
  name, 
  age, 
  countryCode,
  onSettingsPress 
}: ProfileHeaderProps) {
  const flag = countryCodeToFlag(countryCode);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.metadata}>
            Age {age} {flag && ` • ${flag}`}
          </Text>
        </View>
      </View>
      {onSettingsPress && (
        <TouchableOpacity 
          onPress={onSettingsPress} 
          style={styles.settingsButton}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <MaterialCommunityIcons name="cog-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#d1d5db',
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  metadata: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
});
