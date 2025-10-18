# ✨ Conflict/Argument System & Relationship Decay - Quick Reference

## 🎯 What Was Implemented

### ✅ Conflict & Argument System
Players can now have arguments with relationships, creating drama and tension in the game.

**New Actions:**
- 🔥 **Start Argument**: Damages relationship (-8 to -15), increases conflict (+10 to +20)
- 🤝 **Apologize**: Reduces conflict (-30), improves relationship, only shows when needed

**Features:**
- Context-aware argument topics (career, trust, jealousy, etc.)
- Escalation based on relationship quality (70% at low scores, 5% at high scores)
- Visual conflict badges on relationship cards
- Happiness impacts (-3 to -5 for arguments, +2 for apologies)

---

### ✅ Relationship Decay System
Relationships now naturally deteriorate without maintenance, adding realism to the game.

**Decay Mechanics:**
- Automatic decay when advancing years
- Different rates by relationship type (parents: -2/yr, friends: -5/yr)
- Conflict multiplier (high conflict = faster decay)
- Interaction tracking (recent interactions prevent decay)

**Visual Feedback:**
- Event log shows decay notifications
- Relationship bars show current status
- Conflict badges indicate unresolved issues

---

## 📱 UI Changes

### Relationships Screen Updates:

1. **Member Cards Now Show:**
   - Red conflict badge with "Conflict: X/100" if conflict exists
   - Updated relationship bars reflecting decay
   - Last interaction tracking (internal)

2. **Action Modal New Buttons:**
   - ⚠️ **Start Argument** (red/warning style)
   - 💚 **Apologize** (green, appears only when conflict > 0)

---

## 🎮 How to Test

### Test Conflict System:
```
1. Open Relationships screen
2. Tap any living member
3. Tap "Start Argument" button
4. Observe:
   - Relationship score drops
   - Red conflict badge appears
   - Event log shows argument details
   - Happiness decreases
```

### Test Apology System:
```
1. Find member with conflict badge
2. Open their action modal
3. Tap "Apologize" button (green)
4. Observe:
   - Conflict badge number decreases
   - Relationship score improves
   - Event log confirms apology
   - Happiness increases
```

### Test Relationship Decay:
```
1. Note current relationship scores
2. Advance year (use age up action)
3. Check event log for decay messages
4. Observe relationship scores decreased
5. Interact with member (Spend Time/Gift)
6. Advance year again
7. That member won't decay (interacted recently)
```

---

## 📊 Quick Stats Reference

### Argument Effects:
| Type | Relationship | Conflict | Happiness |
|------|-------------|----------|-----------|
| Normal | -8 | +10 | -3 |
| Escalated | -15 | +20 | -5 |

### Decay Rates (per year):
| Relationship | Decay/Year |
|--------------|------------|
| Parent/Child | -2 |
| Sibling | -3 |
| Best Friend | -4 |
| Partner/Friend | -5 |
| Ex | -1 |

### Apology Effects:
| Situation | Effect |
|-----------|--------|
| With Conflict | -30 conflict, +(conflict reduced / 3) relationship |
| No Conflict | +3 relationship |
| Always | +2 happiness |

---

## 📁 New Files Created

```
✨ src/utils/relationshipDecay.ts
   - Decay calculation functions
   - Escalation logic
   - Argument topic generation

📚 docs/Relationship-Conflict-Decay-Guide.md
   - Complete feature documentation
   - Gameplay strategies
   - Technical details

📝 docs/Relationship-Conflict-Decay-Implementation.md
   - Implementation summary
   - Testing checklist
   - Future enhancements
```

## 📝 Modified Files

```
🔧 src/types/profile.ts
   - Added lastInteractionDate
   - Added conflictLevel

⚙️ src/store/gameStore.ts
   - Added startArgument() action
   - Added apologize() action
   - Updated interaction tracking
   - Integrated decay in advanceYear()

🎨 src/screens/RelationshipsScreen.tsx
   - Added argument button
   - Added apologize button
   - Added conflict badge display
   - New styles and handlers

📖 docs/Relationships-Quick-Start.md
   - Updated with new features
   - Marked old items as implemented
```

---

## 🎯 Key Features at a Glance

### 💥 Conflict System
- **Purpose**: Add drama and realism
- **Trigger**: "Start Argument" button
- **Effect**: Damages relationship, creates tension
- **Recovery**: "Apologize" button

### ⏳ Decay System
- **Purpose**: Require relationship maintenance
- **Trigger**: Automatic on year advance
- **Effect**: Gradual score decline
- **Prevention**: Regular interactions

### 🔄 Integration
- Works seamlessly with existing actions
- Maintains type safety
- Persists through game saves
- Clear event logging

---

## 🚀 Next Steps

**For Testing:**
1. Generate test relationships using existing helpers
2. Test argument system with various relationship types
3. Test decay over multiple years
4. Verify apology system reduces conflict
5. Check UI updates correctly

**For Enhancement:**
- Consider adding more argument topics
- Add personality traits affecting conflict
- Implement relationship breakup mechanics
- Create special reconciliation events

---

## ✅ Implementation Status

- [x] Type definitions extended
- [x] Utility functions created
- [x] Store actions implemented
- [x] UI components updated
- [x] Decay integration complete
- [x] Documentation written
- [x] Zero compilation errors
- [x] Ready for testing

---

**🎊 Implementation Complete!**

The SimsLyfe relationship system now features realistic conflict mechanics and natural relationship decay, adding depth and strategy to relationship management.

---

## 📞 Quick Help

**Problem**: Can't see conflict badge
**Solution**: Start an argument first to create conflict

**Problem**: Apologize button not showing
**Solution**: Only appears when conflict > 0

**Problem**: Relationships not decaying
**Solution**: Decay only happens when advancing year

**Problem**: Want to test quickly
**Solution**: Use relationship helpers to generate test family with various scores

---

**For full documentation, see**: `docs/Relationship-Conflict-Decay-Guide.md`
