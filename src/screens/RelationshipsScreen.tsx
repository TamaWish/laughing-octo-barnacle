import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Button } from 'react-native';
import useGameStore from '../store/gameStore';
import { Profile } from '../types/profile';
import { characters, resolveAvatar } from '../constants/characters';
import AppShell from '../components/AppShell';

const FIRST_NAMES = ['Alex','Sam','Taylor','Jordan','Casey','Riley','Jamie','Morgan','Charlie','Avery','Quinn','Dakota','Parker','Rowan','Sydney','Elliot'];

function RelationshipsScreen() {
  const profile = useGameStore((s) => s.profile);
  const [childrenExpanded, setChildrenExpanded] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const openMember = (m: any) => {
    setSelectedMember(m);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
  };

  const partner = profile?.partner;
  const parents = profile?.family?.parents ?? [];
  const siblings = profile?.family?.siblings ?? [];
  const children = (profile?.family && (profile.family as any).children) ?? [];

  const renderMember = (m: any) => {
    const src = resolveAvatar(m as any);
    return (
      <TouchableOpacity key={m.id} onPress={() => openMember(m)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
        {src ? <Image source={src} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }} /> : <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#ddd', marginRight: 12 }} />}
        <View>
          <Text style={{ fontWeight: '700' }}>{`${m.firstName} ${m.lastName ?? ''}`}</Text>
          <Text style={{ color: '#666' }}>{`${m.relation ? `${m.relation}` : ''} • Age ${m.age} • ❤️ ${m.relationshipScore ?? 50}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.actionsRow, { marginTop: 12 }]}>
      <Text style={styles.sectionTitle}>Relationships</Text>

      <View style={[styles.card, { marginTop: 8 }]}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Partner</Text>
        {partner ? renderMember(partner) : <TouchableOpacity onPress={() => {
          const newPartner = {
            id: `p-${Date.now()}`,
            relation: 'partner',
            avatar: Math.floor(Math.random() * characters.length),
            gender: Math.random() < 0.5 ? 'female' : 'male',
            firstName: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
            lastName: profile?.lastName ?? '',
            age: Math.floor(Math.random() * 30) + 18,
            alive: true,
            relationshipScore: 50, // Add initial relationship score
          } as any;
          const p = useGameStore.getState();
          p.setProfile({ ...(p.profile as any), partner: newPartner });
        }}><Text style={{ color: '#2b8cff' }}>Add random partner</Text></TouchableOpacity>}
      </View>

      <View style={[styles.card, { marginTop: 8 }]}>
        <Text style={{ fontWeight: '600', marginTop: 4 }}>Parents</Text>
        {parents.length === 0 ? <Text style={{ color: '#666' }}>No parents found.</Text> : parents.map(renderMember)}
        <Text style={{ fontWeight: '600', marginTop: 8 }}>Siblings</Text>
        {siblings.length === 0 ? <Text style={{ color: '#666' }}>No siblings.</Text> : siblings.map(renderMember)}
      </View>

      <View style={[styles.card, { marginTop: 8 }]}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Children</Text>
        {children.length === 0 && <Text style={{ color: '#666' }}>No children yet.</Text>}
        {children.length > 0 && (
          <>
            {children.length >= 5 ? (
              <>
                <TouchableOpacity onPress={() => setChildrenExpanded((v) => !v)} style={{ marginBottom: 8 }}>
                  <Text style={{ color: '#2b8cff' }}>{childrenExpanded ? 'Collapse children' : `Show ${children.length} children`}</Text>
                </TouchableOpacity>
                {childrenExpanded && children.map(renderMember)}
              </>
            ) : (
              children.map(renderMember)
            )}
          </>
        )}
      </View>

      <View style={[styles.card, { marginTop: 8 }]}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Friends</Text>
        <Text style={{ color: '#666' }}>Friends will appear here.</Text>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            {selectedMember ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {selectedMember ? (
                    <Image source={resolveAvatar(selectedMember)} style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }} />
                  ) : (
                    <View style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#ddd', marginRight: 12 }} />
                  )}
                  <View>
                    <Text style={{ fontWeight: '800', fontSize: 18 }}>{`${selectedMember.firstName} ${selectedMember.lastName ?? ''}`}</Text>
                    <Text style={{ color: '#666' }}>{`${selectedMember.relation} • Age ${selectedMember.age} • ❤️ ${selectedMember.relationshipScore ?? 50}`}</Text>
                  </View>
                </View>
                <View style={{ height: 12 }} />
                <Button title="Spend Time (+5 Rel, +2 Hap)" onPress={() => {
                  const st = useGameStore.getState();
                  st.spendTimewithFamilyMember(selectedMember.id);
                  closeModal();
                }} />
                <View style={{ height: 8 }} />
                <Button title="Give Gift (-$50, +10 Rel)" onPress={() => {
                  const st = useGameStore.getState();
                  st.giveGiftToFamilyMember(selectedMember.id, 50);
                  closeModal();
                }} />
                <View style={{ height: 8 }} />
                <Button title="Add child to this member" onPress={() => {
                  const st = useGameStore.getState();
                  const child = {
                    id: `c-${Date.now()}`,
                    relation: 'child',
                    avatar: Math.floor(Math.random() * characters.length),
                    gender: Math.random() < 0.5 ? 'female' : 'male',
                    firstName: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
                    lastName: st.profile?.lastName ?? '',
                    age: 0,
                    alive: true,
                    relationshipScore: 80, // Children start with a higher score
                  } as any;
                  const fam = st.profile?.family ?? { parents: [], siblings: [], children: [] };
                  const nextFam = { ...fam, children: [...(fam.children ?? []), child] };
                  st.setProfile({ ...(st.profile as any), family: nextFam });
                  closeModal();
                  st.addEvent(`A child was born: ${child.firstName} ${child.lastName}`);
                }} />
                <View style={{ height: 8 }} />
                <Button title="Remove member" color="crimson" onPress={() => {
                  const st = useGameStore.getState();
                  const prof = st.profile as any;
                  const fam = prof.family ?? { parents: [], siblings: [], children: [] };
                  const removeFrom = fam[`${selectedMember.relation}s`] ?? [];
                  const nextArr = (removeFrom as any[]).filter((x) => x.id !== selectedMember.id);
                  const nextFam = { ...fam, [`${selectedMember.relation}s`]: nextArr };
                  st.setProfile({ ...prof, family: nextFam });
                  closeModal();
                  st.addEvent(`Removed ${selectedMember.firstName} from family.`);
                }} />
                <View style={{ height: 8 }} />
                <Button title="Close" onPress={closeModal} />
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function RelationshipsScreenWrapped() {
  return (
    <AppShell>
      <RelationshipsScreen />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  actionsRow: { marginTop: 12, paddingHorizontal: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 22, marginBottom: 8 },
  card: { width: '100%', backgroundColor: '#fff', padding: 12, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
});