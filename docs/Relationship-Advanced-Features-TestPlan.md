# Advanced Relationship Features - Test Plan

## 🧪 Testing Overview

This document provides a comprehensive testing guide for the newly implemented advanced relationship features:
- Personality System
- Personality-Based Apology Effectiveness
- Conflict Memory System
- Make-Up Events
- Relationship Breakups at Score 0

---

## 📋 Test Scenarios

### 1. Personality System Tests

#### Test 1.1: Personality Assignment
**Steps:**
1. Start new game or use existing profile
2. Navigate to Relationships screen
3. Open any relationship member (who hasn't been interacted with)
4. Perform an action (Spend Time, Compliment, etc.)
5. Open the member again

**Expected Result:**
- Member should have a personality assigned
- Personality badge should display in modal header
- Personality should be one of: Forgiving, Easygoing, Aggressive, Stubborn

#### Test 1.2: Personality Persistence
**Steps:**
1. Note a member's personality
2. Perform multiple actions with them
3. Close and reopen the app
4. Check the member's personality again

**Expected Result:**
- Personality remains the same across sessions
- Badge continues to display correctly

#### Test 1.3: All Personality Types
**Steps:**
1. Interact with multiple NPCs (at least 10)
2. Check their personalities

**Expected Result:**
- See variety of personality types
- Not all the same personality

---

### 2. Personality-Based Apology Tests

#### Test 2.1: Forgiving Personality Apology
**Steps:**
1. Find/create a member with Forgiving personality
2. Start an argument to create conflict (20-30 points)
3. Note the conflict level
4. Apologize
5. Check event log

**Expected Result:**
- Conflict reduced by ~45 points (30 × 1.5)
- Relationship improved by ~15 points
- Event log shows personality bonus (+50%)

#### Test 2.2: Stubborn Personality Apology
**Steps:**
1. Find/create a member with Stubborn personality
2. Start an argument to create conflict (20-30 points)
3. Note the conflict level
4. Apologize
5. Check event log

**Expected Result:**
- Conflict reduced by ~21 points (30 × 0.7)
- Relationship improved by ~7 points
- Event log shows personality penalty (-30%)

#### Test 2.3: Aggressive vs Easygoing Comparison
**Steps:**
1. Create two members with same conflict level (30)
2. One Aggressive, one Easygoing
3. Apologize to both
4. Compare results

**Expected Result:**
- Easygoing: Better conflict reduction and relationship boost
- Aggressive: Less effective apology
- Clear difference in event log messages

---

### 3. Conflict Memory Tests

#### Test 3.1: Memory Creation
**Steps:**
1. Start argument with a member
2. Note the topic (e.g., "trust issues")
3. Open member modal
4. Check conflict memory section

**Expected Result:**
- New conflict appears in memory
- Shows correct topic
- Shows severity (minor or major based on escalation)
- Marked as "Unresolved"
- Red alert icon displayed

#### Test 3.2: Memory Resolution
**Steps:**
1. Member with at least one unresolved conflict
2. Apologize to them
3. Check conflict memory

**Expected Result:**
- Most recent conflict marked as "Resolved"
- Green checkmark icon displayed
- Other conflicts remain unresolved

#### Test 3.3: Memory Limit (10 conflicts)
**Steps:**
1. Start 12 arguments with same member
2. Check conflict memory

**Expected Result:**
- Only last 10 conflicts stored
- Oldest 2 conflicts discarded
- UI shows last 3 conflicts

#### Test 3.4: Memory Display
**Steps:**
1. Create 5 conflicts with a member
2. Resolve 2 of them (apologize twice)
3. Check memory display

**Expected Result:**
- Last 3 conflicts displayed
- Resolved conflicts show green checkmark
- Unresolved show red alert
- Topics and severity correct

---

### 4. Make-Up Event Tests

#### Test 4.1: Make-Up Button Visibility
**Steps:**
1. Member with conflict = 0: Check for Make-Up button
2. Member with conflict = 29: Check for Make-Up button
3. Member with conflict = 30: Check for Make-Up button
4. Member with conflict = 50: Check for Make-Up button

**Expected Result:**
- Conflict < 30: No Make-Up button
- Conflict ≥ 30: Make-Up button visible
- Button styled in pink with 💕 emoji

#### Test 4.2: Normal Make-Up (Conflict 30-49)
**Steps:**
1. Member with conflict = 40
2. Note relationship score
3. Tap Make Up button
4. Check results

**Expected Result:**
- Conflict reduced by 80% (40 → 8)
- Relationship increased by +15
- Happiness increased by +3
- All conflicts marked as resolved
- Event log: "💕 Made up with [Name]..."
- Toast notification displayed

#### Test 4.3: High-Conflict Make-Up (Conflict 50+)
**Steps:**
1. Member with conflict = 60
2. Note relationship score
3. Tap Make Up button
4. Check results

**Expected Result:**
- Conflict reduced by 80% (60 → 12)
- Relationship increased by +30 (2× bonus)
- Happiness increased by +5 (bonus)
- All conflicts marked as resolved
- Event log mentions "serious conflicts"
- Special toast notification

#### Test 4.4: Make-Up Resolves All Conflicts
**Steps:**
1. Create 3 unresolved conflicts
2. Use Make Up
3. Check conflict memory

**Expected Result:**
- All 3 conflicts marked as resolved
- All show green checkmarks
- "Resolved" text displayed for each

---

### 5. Breakup System Tests

#### Test 5.1: Breakup via Argument
**Steps:**
1. Partner with relationship score = 8
2. Start argument (should reduce by 8-15)
3. Watch for breakup

**Expected Result:**
- Relationship hits 0
- Immediate breakup occurs
- Event log: "💔 Your relationship with [Name] has ended"
- Toast: "💔 Relationship Ended"
- Partner moved to exes list
- Status: "Broken up"
- Partner slot now empty/null

#### Test 5.2: Breakup via Decay
**Steps:**
1. Partner with relationship score = 5
2. Set up decay conditions (no interaction for years)
3. Advance year
4. Check for breakup

**Expected Result:**
- Decay reduces score to 0
- Breakup triggered automatically
- Same notifications as Test 5.1
- Partner moved to exes

#### Test 5.3: Prevent Breakup with Make-Up
**Steps:**
1. Partner at score = 15, conflict = 60
2. Note that argument would cause breakup
3. Use Make Up before arguing
4. Relationship should be ~45 now
5. Safe to interact

**Expected Result:**
- Make-Up prevents future breakup
- Relationship stabilized
- Can continue relationship

#### Test 5.4: Non-Partners Don't Break Up
**Steps:**
1. Friend with relationship score = 0
2. Check if moved to different category

**Expected Result:**
- Friend remains in friends list
- No breakup occurs
- Only romantic relationships break up

#### Test 5.5: Ex Status Persistence
**Steps:**
1. Cause a breakup
2. Check exes list
3. Close and reopen app
4. Check exes list again

**Expected Result:**
- Ex remains in exes list
- Status shows "Broken up"
- Persists across sessions

---

### 6. Integration Tests

#### Test 6.1: Complete Relationship Cycle
**Steps:**
1. Start with partner, good relationship (80)
2. Have multiple arguments (score → 40)
3. Check personality
4. Apologize (personality affects effectiveness)
5. Check conflict memory
6. More arguments (score → 10)
7. Use Make-Up before breakup
8. Verify recovery

**Expected Result:**
- Full cycle works smoothly
- Personality affects apology throughout
- Memory tracks all conflicts
- Make-Up prevents breakup
- Relationship recovers

#### Test 6.2: Personality + Memory + Make-Up
**Steps:**
1. Stubborn personality member
2. Create 3 conflicts (harder to resolve due to personality)
3. Apologize twice (resolves 2)
4. Check memory (1 unresolved, 2 resolved)
5. Create 2 more conflicts
6. Use Make-Up
7. Verify all 5 conflicts resolved

**Expected Result:**
- Stubborn personality makes apologies less effective
- Memory correctly tracks resolution status
- Make-Up resolves all remaining conflicts
- System integration works seamlessly

#### Test 6.3: Multiple Breakups
**Steps:**
1. Cause breakup with partner
2. Check exes list (1 ex)
3. Get new partner (through game mechanics)
4. Cause another breakup
5. Check exes list

**Expected Result:**
- Both exes in exes list
- Each has "Broken up" status
- No data corruption
- Each has their own conflict memory

---

## 🎯 Edge Cases

### Edge Case 1: Conflict at Exactly 30
- Make-Up button should appear
- Should work correctly

### Edge Case 2: Score at Exactly 0
- Breakup should trigger
- No negative scores

### Edge Case 3: Multiple Conflicts Same Topic
- Each recorded separately
- All tracked in memory

### Edge Case 4: Apologize with 0 Conflict
- Should still improve relationship slightly
- No crash or error

### Edge Case 5: Make-Up with No Memory
- Should still work
- No errors if conflict memory empty

---

## 📊 Success Criteria

### Must Pass:
- ✅ All personality types can be assigned
- ✅ Personality affects apology effectiveness
- ✅ Conflict memory tracks correctly
- ✅ Make-Up button appears at threshold
- ✅ Make-Up resolves all conflicts
- ✅ Breakups occur at score 0
- ✅ Partner moved to exes correctly
- ✅ No crashes or errors
- ✅ Data persists across sessions

### Should Pass:
- ✅ UI updates immediately
- ✅ Event logs are clear and informative
- ✅ Toast notifications are appropriate
- ✅ Styling is consistent
- ✅ Icons display correctly

---

## 🐛 Bug Reporting Template

If you find issues during testing:

```
**Bug Title**: [Brief description]

**Feature**: [Personality/Memory/Make-Up/Breakup]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [Third step]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happened]

**Screenshots/Logs**: [If applicable]

**Priority**: [High/Medium/Low]
```

---

## ✅ Testing Checklist

### Personality System
- [ ] Personality assigned on first interaction
- [ ] All 4 types appear across multiple NPCs
- [ ] Personality badge displays correctly
- [ ] Personality persists across sessions

### Apology Effectiveness
- [ ] Forgiving: +50% effectiveness verified
- [ ] Easygoing: +20% effectiveness verified
- [ ] Aggressive: -20% effectiveness verified
- [ ] Stubborn: -30% effectiveness verified
- [ ] Event logs show personality bonus/penalty

### Conflict Memory
- [ ] Conflicts added to memory correctly
- [ ] Topics display accurately
- [ ] Severity (minor/major) correct
- [ ] Resolution status tracks correctly
- [ ] UI shows last 3 conflicts
- [ ] Memory limit (10) enforced
- [ ] Visual indicators (checkmark/alert) correct

### Make-Up Events
- [ ] Button appears at conflict ≥ 30
- [ ] Button hidden at conflict < 30
- [ ] Normal make-up (+15) works
- [ ] High-conflict make-up (+30) works
- [ ] Resolves all conflicts in memory
- [ ] Happiness bonus correct
- [ ] Event log and toast appropriate

### Breakup System
- [ ] Breakup occurs at score = 0
- [ ] Partner moved to exes
- [ ] Status set to "Broken up"
- [ ] Event log shows 💔
- [ ] Toast notification displays
- [ ] Only romantic relationships break up
- [ ] Breakup after argument works
- [ ] Breakup after decay works

### Integration
- [ ] All features work together
- [ ] No conflicts between systems
- [ ] Data integrity maintained
- [ ] Performance acceptable
- [ ] No memory leaks

---

**Testing Status**: Ready for comprehensive testing
**Last Updated**: October 18, 2025
