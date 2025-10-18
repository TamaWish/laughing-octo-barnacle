# Relationship Conflict & Decay System - Guide

## 🎯 Overview

SimsLyfe now features a comprehensive **Conflict/Argument System** and **Relationship Decay** mechanics that add realism and depth to relationship management. Relationships require active maintenance and can deteriorate if neglected or damaged through conflicts.

**✨ Latest Updates (v2):**
- All positive interactions now prevent decay
- Enhanced toast notifications with argument details
- Animated conflict badges with shake/pulse effects

---

## 🔥 Conflict & Argument System

### What is the Conflict System?

The conflict system allows players to have arguments with family members, friends, and romantic partners. Arguments damage relationships and create tension that must be resolved through apologies.

### Key Features:

- **Start Arguments**: Initiate conflicts with any living relationship member
- **Conflict Levels**: Track unresolved tension (0-100 scale)
- **Escalation Mechanics**: Arguments can escalate based on relationship score
- **Context-Aware Topics**: Argument topics vary by relationship type
- **Apology System**: Resolve conflicts and repair relationships

---

## 💥 How Arguments Work

### Starting an Argument

1. Navigate to **Relationships** screen
2. Tap on any relationship member
3. Tap **"Start Argument"** button (red warning button)
4. The argument will damage the relationship and increase conflict level

### Argument Effects:

- **Relationship Score**: -8 to -15 points (depending on escalation)
- **Conflict Level**: +10 to +20 points
- **Happiness**: -3 to -5 points
- **Last Interaction Date**: Updated to current game date

### Escalation System

Arguments have a chance to **escalate** based on the current relationship score:

| Relationship Score | Escalation Chance |
|-------------------|-------------------|
| 0-20              | 70%               |
| 21-40             | 50%               |
| 41-60             | 30%               |
| 61-80             | 15%               |
| 81-100            | 5%                |

**Escalated arguments** cause:
- Higher relationship damage (-15 instead of -8)
- More conflict buildup (+20 instead of +10)
- Greater happiness loss (-5 instead of -3)

### Argument Topics

The system generates context-appropriate argument topics:

**Parent/Child Relationships:**
- Curfew and rules
- Career choices
- Lifestyle decisions
- Family obligations
- Money management

**Romantic Relationships:**
- Lack of attention
- Trust issues
- Future plans
- Spending habits
- Time management

**Friendships:**
- Broken promises
- Gossip
- Jealousy
- Borrowed money
- Neglected friendship

**Siblings:**
- Childhood rivalries
- Parental favoritism
- Borrowed belongings
- Different values
- Family responsibilities

---

## 🤝 Apology System

### When to Apologize

The **"Apologize"** button appears when a relationship member has a conflict level greater than 0. This is indicated by:
- Red conflict badge on member card showing "Conflict: X/100"
- Green apology button in the action modal

### Apology Effects:

**If Conflict Exists (>0):**
- Conflict Level: -30 points (capped at current level)
- Relationship Score: +1 point per 3 conflict points resolved
- Happiness: +2 points

**If No Conflict (preventive apology):**
- Relationship Score: +3 points
- Happiness: +2 points

### Example:

If a member has **Conflict Level: 60**:
1. Apologize reduces conflict by 30 → New level: 30
2. Relationship improves by 10 points (30 / 3)
3. Happiness increases by 2

---

## ⏳ Relationship Decay System

### What is Relationship Decay?

All relationships naturally deteriorate over time if not maintained. Each year that passes without interaction causes relationships to decay based on their type and conflict level.

### Decay Rates by Relationship Type:

| Relationship Type    | Decay Per Year |
|---------------------|----------------|
| Parent/Child        | -2 points      |
| Sibling             | -3 points      |
| Grandparent/Grandchild | -3 points   |
| Spouse/Partner/Lover | -5 points     |
| Best Friend         | -4 points      |
| Friend              | -5 points      |
| Ex                  | -1 point       |
| Follower            | -2 points      |

### Conflict Multiplier

Conflict level **accelerates** relationship decay:

**Formula:** `Decay Amount = Base Decay × (1 + Conflict Level / 100)`

**Examples:**
- Friend with 0 conflict: -5 points/year
- Friend with 50 conflict: -7.5 points/year (5 × 1.5)
- Friend with 100 conflict: -10 points/year (5 × 2.0)

### When Decay Occurs

Relationship decay is automatically applied when you **advance a year** in the game. The system:
1. Calculates years since last interaction for each member
2. Applies appropriate decay based on relationship type and conflict
3. Logs significant relationship changes to the event log
4. Updates all affected relationship scores

### Decay Events

The event log will show relationship decay notifications:
```
Relationship decay: John: Relationship declined by 5 (45/100)
Relationship decay: Sarah: Relationship declined by 8 (32/100)
...and 4 more relationships declined.
```

---

## 🛡️ Preventing Decay

### Maintaining Relationships

To prevent or slow relationship decay, regularly interact with members:

1. **Spend Time** - Free, +5 relationship, +2 happiness, prevents decay ✅
2. **Give Gift** - €100, +10 relationship, prevents decay ✅
3. **Compliment** - Free, +2 relationship, +1 happiness, prevents decay ✅ **(NEW)**
4. **Conversation** - Free, +3 relationship, +2 happiness, prevents decay ✅ **(NEW)**

**All positive interactions now update `lastInteractionDate` to prevent decay!**

### Best Practices:

- **Check Conflict Badges**: Prioritize members with animated red badges
- **Monitor Decay**: Relationships naturally decline each year
- **Regular Interaction**: Use free actions (Compliment, Conversation) frequently
- **Resolve Conflicts**: Apologize when conflict levels are high
- **Resource Management**: Save gifts for major relationship repairs

---

## 📊 Technical Details

### Data Structure

Each `FamilyMember` now includes:

```typescript
{
  id: string;
  firstName: string;
  relationshipScore?: number;      // 0-100
  conflictLevel?: number;          // 0-100 (NEW)
  lastInteractionDate?: string;    // ISO date string (NEW)
  alive?: boolean;
  // ... other fields
}
```

### Store Actions

New actions available in `gameStore`:

```typescript
startArgument(memberId: string): void
// Starts an argument, damages relationship, increases conflict

apologize(memberId: string): void
// Apologizes, reduces conflict, improves relationship
```

Updated actions that now track interaction dates:

```typescript
spendTimewithFamilyMember(memberId: string): void
giveGiftToFamilyMember(memberId: string, cost: number): void
```

### Decay Calculation

Located in `src/utils/relationshipDecay.ts`:

```typescript
applyRelationshipDecay(
  profile: Profile,
  currentGameDate: string
): { updatedProfile: Profile; decayEvents: string[] }
```

This function:
1. Iterates through all relationships
2. Calculates years since last interaction
3. Applies decay based on type and conflict
4. Returns updated profile and event descriptions

---

## 🎮 Gameplay Strategy

### High-Value Relationships

**Immediate Family** (parents, children):
- Lowest decay rate (-2/year)
- Less prone to escalation
- Important for emotional stability

**Romantic Partners**:
- Highest decay rate (-5/year)
- Requires regular attention
- High escalation risk at low scores

**Best Friends**:
- Moderate decay (-4/year)
- Easier to maintain than romantic
- Social support network

### Conflict Management

1. **Prevention**: Avoid arguments when relationship score is low (high escalation risk)
2. **Strategic Conflicts**: Use arguments to add drama/realism to gameplay
3. **Timely Apologies**: Resolve conflicts before they compound with decay
4. **Maintenance Schedule**: Interact with key relationships every year or two

### Resource Allocation

**Free Actions** (Spend Time, Argue, Apologize):
- No monetary cost
- Can be done anytime
- +5 relationship for Spend Time

**Paid Actions** (Give Gift):
- €100 cost
- +10 relationship boost
- Best for quickly repairing damaged relationships

---

## 🔍 Visual Indicators

### Relationship Cards

- **Relationship Bar**: Color-coded (red to green) based on score
- **Conflict Badge**: Red badge showing "Conflict: X/100" if > 0
- **Score Display**: Shows current score out of 100

### Action Modal

- **Standard Actions**: Blue/purple/yellow icons (positive)
- **Start Argument**: Red icon with warning style (negative)
- **Apologize**: Green icon (only visible if conflict > 0)

---

## 📝 Event Log Examples

```
Had an argument with Mom about career choices. Relationship -8, Conflict +10, Happiness -3.

Had an argument with Sarah about trust issues. The argument escalated! Relationship -15, Conflict +20, Happiness -5.

Apologized to John. Conflict reduced, relationship improved. Happiness +2.

Spent time with Dad. Relationship +5, Happiness +2.

Relationship decay: Emma: Relationship declined by 5 (45/100)
Relationship decay: Alex: Relationship declined by 12 (23/100)
```

---

## 🚀 Future Enhancements

Potential additions to the conflict/decay system:

- **Breakup Mechanics**: Relationships ending at very low scores
- **Reconciliation Events**: Special activities to restore damaged relationships
- **Personality Traits**: Different conflict styles and decay rates
- **Memory System**: NPCs remember past conflicts
- **Mediation**: Third-party intervention for severe conflicts
- **Therapy/Counseling**: Professional help for relationship repair
- **Social Consequences**: Arguments affecting other relationships
- **Make-Up Events**: Special positive interactions after conflicts

---

## 🐛 Troubleshooting

**Q: Why isn't my relationship decaying?**
A: Decay only occurs when you advance a year. If you've interacted with someone in the current game year, they won't decay this year.

**Q: Can I have an argument with a deceased member?**
A: No, the "Start Argument" button only appears for living members.

**Q: Does apologizing always reduce conflict to zero?**
A: No, apologizing reduces conflict by up to 30 points. Multiple apologies may be needed for high conflict levels.

**Q: What happens if relationship score reaches 0?**
A: Currently, it stays at 0. Future updates may add relationship breakup mechanics.

**Q: Do Compliment and Conversation update lastInteractionDate?**
A: Not currently, but this may be added in future updates.

---

## ✅ Summary

- **Arguments damage relationships** and create conflict tension
- **Conflict accelerates decay** if left unresolved
- **Apologies reduce conflict** and repair relationships
- **All relationships decay over time** without interaction
- **Different relationship types** have different decay rates
- **Visual indicators** show conflict status on member cards
- **Strategic gameplay** requires balancing maintenance vs. realism

**Maintain your relationships or watch them crumble! 💔**
