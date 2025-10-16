import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ActionCard = ({ icon, title, desc, primary, secondary, onPrimary, onSecondary }: { icon?: string; title: string; desc: string; primary: string; secondary?: string; onPrimary?: () => void; onSecondary?: () => void }) => (
  <View style={[styles.card, styles.cardPeek]}>
    {icon ? <View style={styles.cardIconWrap}><Text style={styles.cardIcon}>{icon}</Text></View> : null}
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
    <View style={styles.cardButtons}>
      <TouchableOpacity style={styles.cardPrimary} onPress={() => onPrimary && onPrimary()}>
        <Text style={styles.cardPrimaryText}>{primary}</Text>
      </TouchableOpacity>
      {secondary ? (
        <TouchableOpacity style={styles.cardSecondaryLink} onPress={() => onSecondary && onSecondary()}>
          <Text style={styles.cardSecondaryLinkText}>{secondary}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { width: 220, backgroundColor: '#fff', padding: 12, borderRadius: 10, marginRight: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardPeek: { width: 240 },
  cardIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eef6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
  cardDesc: { color: '#666', fontSize: 13, marginBottom: 8 },
  cardButtons: { flexDirection: 'row', marginTop: 6 },
  cardPrimary: { backgroundColor: '#2b8cff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  cardPrimaryText: { color: '#fff', fontWeight: '700' },
  cardSecondaryLink: { marginLeft: 12, alignSelf: 'center' },
  cardSecondaryLinkText: { color: '#6b7280', textDecorationLine: 'underline' },
});

export default ActionCard;