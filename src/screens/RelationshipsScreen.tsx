import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, Modal, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import useGameStore from '../store/gameStore';
import { FamilyMember } from '../types/profile';
import { resolveAvatar } from '../constants/characters';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'Relationships'>;

// Animated Conflict Badge Component
const AnimatedConflictBadge: React.FC<{ conflictLevel: number; memberId: string }> = ({ conflictLevel, memberId }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const prevConflictRef = useRef(conflictLevel);

  useEffect(() => {
    // Trigger animation when conflict increases
    if (conflictLevel > prevConflictRef.current) {
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    prevConflictRef.current = conflictLevel;
  }, [conflictLevel]);

  return (
    <Animated.View
      style={[
        styles.conflictBadge,
        {
          transform: [
            { scale: pulseAnim },
            { translateX: shakeAnim }
          ],
        },
      ]}
    >
      <MaterialCommunityIcons name="alert" size={12} color="#dc2626" />
      <Text style={styles.conflictText}>Conflict: {conflictLevel}/100</Text>
    </Animated.View>
  );
};

export default function RelationshipsScreen({ navigation, route }: Props) {
  const profile = useGameStore((s) => s.profile);
  const spendTimewithFamilyMember = useGameStore((s) => s.spendTimewithFamilyMember);
  const giveGiftToFamilyMember = useGameStore((s) => s.giveGiftToFamilyMember);
  const complimentFamilyMember = useGameStore((s) => s.complimentFamilyMember);
  const conversationWithFamilyMember = useGameStore((s) => s.conversationWithFamilyMember);
  const startArgument = useGameStore((s) => s.startArgument);
  const apologize = useGameStore((s) => s.apologize);
  const money = useGameStore((s) => s.money);
  const { width } = useWindowDimensions();

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Ensure the shared currentGameTab reflects Relationships when this screen is active
  useEffect(() => {
    const setTab = useGameStore.getState().setCurrentGameTab;
    setTab && setTab('Relationships');
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No profile found</Text>
      </View>
    );
  }

  // Helper to get relationship color based on score
  const getRelationshipColor = (score?: number): string => {
    if (!score) return '#6b7280';
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // yellow
    if (score >= 20) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Helper to get relationship bar width
  const getRelationshipWidth = (score?: number): number => {
    return score ?? 50;
  };

  // Render a relationship member card
  const renderMemberCard = (member: FamilyMember, showRelationType: boolean = true) => {
    const avatar = resolveAvatar({ avatar: member.avatar, gender: member.gender });
    const relationshipScore = member.relationshipScore ?? 50;
    const isAlive = member.alive !== false;

    return (
      <TouchableOpacity
        key={member.id}
        style={[styles.memberCard, !isAlive && styles.deceasedCard]}
        onPress={() => {
          setSelectedMember(member);
          setShowActionModal(true);
        }}
        accessibilityRole="button"
      >
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.memberInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.memberName}>
              {member.firstName} {member.lastName || ''}
            </Text>
            {showRelationType && (
              <Text style={styles.relationType}>
                ({member.relation === 'best-friend' ? 'Best Friend' : member.relation.charAt(0).toUpperCase() + member.relation.slice(1)})
              </Text>
            )}
          </View>
          <Text style={styles.memberAge}>
            Age {member.age} {!isAlive && '† Deceased'}
          </Text>
          {member.status && <Text style={styles.memberStatus}>{member.status}</Text>}
          {(member.conflictLevel ?? 0) > 0 && (
            <AnimatedConflictBadge conflictLevel={member.conflictLevel!} memberId={member.id} />
          )}
          <View style={styles.relationshipBar}>
            <View 
              style={[
                styles.relationshipFill, 
                { 
                  width: `${getRelationshipWidth(relationshipScore)}%`,
                  backgroundColor: getRelationshipColor(relationshipScore)
                }
              ]} 
            />
          </View>
          <Text style={styles.relationshipText}>Relationship: {relationshipScore}/100</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6b7280" />
      </TouchableOpacity>
    );
  };

  // Render a section header
  const renderSectionHeader = (title: string, icon: string, count: number) => {
    if (count === 0) return null;
    
    return (
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#3b82f6" />
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
    );
  };

  // Get all relationship categories with their members
  const followers = profile.followers || [];
  const commune = followers.filter(f => f.relation === 'follower');
  
  const partner = profile.partner ? [profile.partner] : [];
  const exes = profile.exes || [];
  
  const grandparents = profile.family?.grandparents || [];
  const parents = profile.family?.parents || [];
  const siblings = profile.family?.siblings || [];
  const children = profile.family?.children || [];
  const grandchildren = profile.family?.grandchildren || [];
  
  const friends = profile.friends || [];
  const bestFriends = friends.filter(f => f.relation === 'best-friend');
  const regularFriends = friends.filter(f => f.relation === 'friend');

  // Handle member actions
  const handleSpendTime = () => {
    if (selectedMember) {
      spendTimewithFamilyMember(selectedMember.id);
      setShowActionModal(false);
      Toast.show({
        type: 'success',
        text1: 'Time well spent!',
        text2: `You spent quality time with ${selectedMember.firstName}`,
      });
    }
  };

  const handleGiveGift = (amount: number) => {
    if (selectedMember) {
      if (money < amount) {
        Toast.show({
          type: 'error',
          text1: 'Not enough money',
          text2: `You need €${amount} to give this gift`,
        });
        return;
      }
      giveGiftToFamilyMember(selectedMember.id, amount);
      setShowActionModal(false);
      Toast.show({
        type: 'success',
        text1: 'Gift given!',
        text2: `${selectedMember.firstName} loved your gift!`,
      });
    }
  };

  const handleCompliment = () => {
    if (selectedMember) {
      complimentFamilyMember(selectedMember.id);
      setShowActionModal(false);
      Toast.show({
        type: 'success',
        text1: 'Compliment given!',
        text2: `${selectedMember.firstName} appreciated your kind words (+2 relationship)`,
      });
    }
  };

  const handleConversation = () => {
    if (selectedMember) {
      conversationWithFamilyMember(selectedMember.id);
      setShowActionModal(false);
      Toast.show({
        type: 'success',
        text1: 'Great conversation!',
        text2: `You had a meaningful talk with ${selectedMember.firstName} (+3 relationship)`,
      });
    }
  };

  const handleArgue = () => {
    if (selectedMember) {
      const result = startArgument(selectedMember.id);
      setShowActionModal(false);
      
      if (result) {
        const { memberName, topic, escalated, relationshipChange, conflictChange } = result;
        Toast.show({
          type: 'error',
          text1: escalated ? '⚠️ Argument Escalated!' : 'Argument Started',
          text2: `You argued with ${memberName} about ${topic} (${relationshipChange} relationship, +${conflictChange} conflict)`,
          visibilityTime: 4000,
        });
      }
    }
  };

  const handleApologize = () => {
    if (selectedMember) {
      apologize(selectedMember.id);
      setShowActionModal(false);
      Toast.show({
        type: 'success',
        text1: 'Apology accepted',
        text2: `${selectedMember.firstName} appreciated your apology`,
      });
    }
  };

  const handleMakeUp = () => {
    if (selectedMember) {
      const makeUp = useGameStore.getState().makeUp;
      makeUp(selectedMember.id);
      setShowActionModal(false);
      Toast.show({
        type: 'success',
        text1: '💕 Made Up!',
        text2: `You and ${selectedMember.firstName} had a heartfelt moment`,
        visibilityTime: 4000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Followers Section */}
        {commune.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Followers', 'account-group', commune.length)}
            <TouchableOpacity style={styles.communeCard}>
              <MaterialCommunityIcons name="candle" size={40} color="#f59e0b" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.communeName}>Commune</Text>
                <Text style={styles.communeDesc}>Start a cult</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}

        {/* Partner/Lovers Section */}
        {(partner.length > 0 || exes.length > 0) && (
          <View style={styles.section}>
            {renderSectionHeader('Romantic', 'heart', partner.length + exes.length)}
            {partner.map(member => renderMemberCard(member, true))}
            {exes.map(member => renderMemberCard(member, true))}
          </View>
        )}

        {/* Grandparents Section */}
        {grandparents.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Grandparents', 'human-male-female', grandparents.length)}
            {grandparents.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Parents Section */}
        {parents.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Parents', 'account-supervisor', parents.length)}
            {parents.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Siblings Section */}
        {siblings.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Siblings', 'account-multiple', siblings.length)}
            {siblings.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Children Section */}
        {children.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Children', 'baby-face', children.length)}
            {children.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Grandchildren Section */}
        {grandchildren.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Grandchildren', 'baby', grandchildren.length)}
            {grandchildren.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Best Friends Section */}
        {bestFriends.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Best Friends', 'star', bestFriends.length)}
            {bestFriends.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Friends Section */}
        {regularFriends.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Friends', 'account-heart', regularFriends.length)}
            {regularFriends.map(member => renderMemberCard(member, false))}
          </View>
        )}

        {/* Empty State */}
        {partner.length === 0 && parents.length === 0 && siblings.length === 0 && 
         children.length === 0 && friends.length === 0 && grandparents.length === 0 &&
         grandchildren.length === 0 && exes.length === 0 && commune.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-off" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No relationships yet</Text>
            <Text style={styles.emptySubtext}>Start building relationships through activities!</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Modal */}
      {selectedMember && (
        <Modal
          visible={showActionModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowActionModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={() => setShowActionModal(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Image 
                  source={resolveAvatar({ avatar: selectedMember.avatar, gender: selectedMember.gender })} 
                  style={styles.modalAvatar} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalName}>
                    {selectedMember.firstName} {selectedMember.lastName || ''}
                  </Text>
                  <Text style={styles.modalRelation}>
                    {selectedMember.relation === 'best-friend' 
                      ? 'Best Friend' 
                      : selectedMember.relation.charAt(0).toUpperCase() + selectedMember.relation.slice(1)
                    } (Age {selectedMember.age})
                  </Text>
                  {selectedMember.personality && (
                    <View style={styles.personalityBadge}>
                      <MaterialCommunityIcons name="heart" size={14} color="#ec4899" />
                      <Text style={styles.personalityText}>{selectedMember.personality}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => setShowActionModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Conflict Memory Section */}
              {selectedMember.conflictMemory && selectedMember.conflictMemory.length > 0 && (
                <View style={styles.conflictMemorySection}>
                  <Text style={styles.conflictMemoryTitle}>Recent Conflicts:</Text>
                  {selectedMember.conflictMemory.slice(-3).reverse().map((memory, idx) => (
                    <View key={idx} style={styles.conflictMemoryItem}>
                      <MaterialCommunityIcons 
                        name={memory.resolved ? "check-circle" : "alert-circle"} 
                        size={16} 
                        color={memory.resolved ? "#10b981" : "#ef4444"} 
                      />
                      <Text style={styles.conflictMemoryText}>
                        {memory.topic} ({memory.severity})
                        {memory.resolved ? ' - Resolved' : ' - Unresolved'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.actionsSection}>
                <Text style={styles.actionsTitle}>Activities</Text>
                
                {selectedMember.alive !== false && (
                  <>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={handleSpendTime}
                    >
                      <MaterialCommunityIcons name="clock-outline" size={24} color="#3b82f6" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.actionTitle}>Spend Time</Text>
                        <Text style={styles.actionDesc}>Improve relationship (+5)</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleGiveGift(100)}
                    >
                      <MaterialCommunityIcons name="gift" size={24} color="#10b981" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.actionTitle}>Give Gift (€100)</Text>
                        <Text style={styles.actionDesc}>Improve relationship (+10)</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={handleCompliment}
                    >
                      <MaterialCommunityIcons name="emoticon-happy" size={24} color="#f59e0b" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.actionTitle}>Compliment</Text>
                        <Text style={styles.actionDesc}>Say something nice (+2 relationship, prevents decay)</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={handleConversation}
                    >
                      <MaterialCommunityIcons name="chat" size={24} color="#8b5cf6" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.actionTitle}>Conversation</Text>
                        <Text style={styles.actionDesc}>Have a deep talk (+3 relationship, prevents decay)</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.negativeActionButton]}
                      onPress={handleArgue}
                    >
                      <MaterialCommunityIcons name="alert-octagon" size={24} color="#ef4444" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.actionTitle, styles.negativeActionTitle]}>Start Argument</Text>
                        <Text style={styles.actionDesc}>Decrease relationship (-8 to -15)</Text>
                      </View>
                    </TouchableOpacity>

                    {(selectedMember.conflictLevel ?? 0) > 0 && (
                      <>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.positiveActionButton]}
                          onPress={handleApologize}
                        >
                          <MaterialCommunityIcons name="hand-heart" size={24} color="#10b981" />
                          <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[styles.actionTitle, styles.positiveActionTitle]}>Apologize</Text>
                            <Text style={styles.actionDesc}>
                              Resolve conflict (Conflict: {selectedMember.conflictLevel}/100)
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {(selectedMember.conflictLevel ?? 0) >= 30 && (
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.makeUpActionButton]}
                            onPress={handleMakeUp}
                          >
                            <MaterialCommunityIcons name="heart-multiple" size={24} color="#ec4899" />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={[styles.actionTitle, styles.makeUpActionTitle]}>Make Up 💕</Text>
                              <Text style={styles.actionDesc}>
                                Special bonding moment (Major relationship boost)
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </>
                    )}

                    {selectedMember.relation === 'partner' && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                          Toast.show({ type: 'info', text1: 'Feature coming soon!' });
                          setShowActionModal(false);
                        }}
                      >
                        <MaterialCommunityIcons name="movie" size={24} color="#ec4899" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.actionTitle}>Movie Theater</Text>
                          <Text style={styles.actionDesc}>Go to the movies</Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {selectedMember.relation === 'friend' && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                          Toast.show({ type: 'info', text1: 'Feature coming soon!' });
                          setShowActionModal(false);
                        }}
                      >
                        <MaterialCommunityIcons name="food" size={24} color="#f97316" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.actionTitle}>Hang Out</Text>
                          <Text style={styles.actionDesc}>Spend time together</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {selectedMember.alive === false && (
                  <View style={styles.deceasedMessage}>
                    <MaterialCommunityIcons name="candle" size={32} color="#9ca3af" />
                    <Text style={styles.deceasedText}>
                      {selectedMember.firstName} has passed away
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deceasedCard: {
    opacity: 0.6,
    borderColor: '#9ca3af',
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  relationType: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  memberAge: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  memberStatus: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 6,
  },
  conflictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  conflictText: {
    fontSize: 11,
    color: '#dc2626',
    marginLeft: 4,
    fontWeight: '600',
  },
  relationshipBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  relationshipFill: {
    height: '100%',
    borderRadius: 3,
  },
  relationshipText: {
    fontSize: 12,
    color: '#6b7280',
  },
  communeCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  communeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
  },
  communeDesc: {
    fontSize: 14,
    color: '#78350f',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  modalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  modalRelation: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  actionsSection: {
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  negativeActionButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  negativeActionTitle: {
    color: '#dc2626',
  },
  positiveActionButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  positiveActionTitle: {
    color: '#16a34a',
  },
  deceasedMessage: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  deceasedText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  personalityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fce7f3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  personalityText: {
    fontSize: 12,
    color: '#ec4899',
    marginLeft: 4,
    fontWeight: '600',
  },
  conflictMemorySection: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  conflictMemoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  conflictMemoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  conflictMemoryText: {
    fontSize: 12,
    color: '#78350f',
    marginLeft: 6,
    flex: 1,
  },
  makeUpActionButton: {
    backgroundColor: '#fdf2f8',
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  makeUpActionTitle: {
    color: '#ec4899',
  },
});