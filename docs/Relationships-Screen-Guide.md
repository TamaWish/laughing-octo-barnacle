# Relationships Screen Guide

## Overview
The Relationships screen provides a comprehensive view of all the player's relationships, organized by type and generation in a family tree structure. This screen allows players to view, interact with, and manage relationships with family members, friends, partners, and other connections.

## Screen Structure

### 1. Relationship Categories
Relationships are organized into hierarchical sections:

#### **Followers** (Top Level)
- **Commune**: Shows followers for famous/cult leader characters
- Icon: 🕯️ Candle
- Special UI: Yellow highlight card with "Start a cult" subtitle

#### **Romantic Relationships**
- **Partner**: Current spouse, lover, or significant other
- **Exes**: Former romantic partners
- Relation types: `spouse`, `lover`, `partner`, `ex`
- Icon: ❤️ Heart

#### **Family - By Generation**
Organized from oldest to youngest generation:

1. **Grandparents**
   - Mother's and father's parents
   - Icon: 👨‍👩‍👧‍👦 Family group
   - Relation: `grandparent`

2. **Parents**
   - Biological or adoptive parents
   - Icon: 👨‍👩‍👧 Supervisor
   - Relation: `parent`
   - Special feature: Can ask for money for education

3. **Siblings**
   - Brothers and sisters
   - Icon: 👥 Multiple accounts
   - Relation: `sibling`

4. **Children**
   - Player's children
   - Icon: 👶 Baby face
   - Relation: `child`

5. **Grandchildren**
   - Children's children
   - Icon: 🍼 Baby
   - Relation: `grandchild`

#### **Friendship Tier**
- **Best Friends**: Closest friends (special tier)
  - Relation: `best-friend`
  - Icon: ⭐ Star
  
- **Friends**: Regular friends
  - Relation: `friend`
  - Icon: 💕 Heart account

## Member Card Components

Each relationship card displays:

### 1. **Avatar**
- Character image based on gender and avatar ID
- 60x60 rounded circle
- Greyed out if deceased

### 2. **Member Information**
- **Name**: First name + Last name
- **Relation Type**: Shown in parentheses (e.g., "(Father)", "(Best Friend)")
- **Age**: Current age in years
- **Death Status**: "† Deceased" marker if not alive
- **Custom Status**: Optional relationship status (e.g., "Married", "Dating")

### 3. **Relationship Bar**
- Visual bar showing relationship score (0-100)
- Color-coded:
  - 🟢 **Green (80-100)**: Excellent relationship
  - 🔵 **Blue (60-79)**: Good relationship
  - 🟡 **Yellow (40-59)**: Neutral relationship
  - 🟠 **Orange (20-39)**: Poor relationship
  - 🔴 **Red (0-19)**: Very poor relationship
- Text display: "Relationship: X/100"

### 4. **Chevron Icon**
- Right arrow indicating the card is tappable
- Opens action modal

## Interaction Modal

### Modal Header
- Large avatar (60x60)
- Full name
- Relation type and age
- Close button (X)

### Available Actions

#### For Living Members:

1. **Spend Time**
   - Icon: 🕐 Clock
   - Effect: Relationship +5, Happiness +2
   - Cost: Free
   - Description: "Improve relationship (+5)"

2. **Give Gift**
   - Icon: 🎁 Gift box
   - Effect: Relationship +10
   - Cost: €100
   - Description: "Improve relationship (+10)"
   - Requirement: Must have €100

3. **Compliment**
   - Icon: 😊 Happy face
   - Effect: Minor relationship boost
   - Cost: Free
   - Description: "Say something nice"

4. **Conversation**
   - Icon: 💬 Chat
   - Effect: Relationship improvement
   - Cost: Free
   - Description: "Have a deep talk"

5. **Special Activities** (Context-dependent):
   - **Movie Theater** (Partners only)
     - Icon: 🎬 Movie
     - Go to movies together
   
   - **Hang Out** (Friends only)
     - Icon: 🍔 Food
     - Casual meet-up

#### For Deceased Members:
- Shows memorial message with candle icon
- "X has passed away"
- No actions available

## Data Structure

### Profile Type Extensions
```typescript
family?: {
  grandparents?: FamilyMember[];
  parents?: FamilyMember[];
  siblings?: FamilyMember[];
  children?: FamilyMember[];
  grandchildren?: FamilyMember[];
};
partner?: FamilyMember | null;
friends?: FamilyMember[];
exes?: FamilyMember[];
followers?: FamilyMember[];
```

### FamilyMember Type
```typescript
{
  id: string;
  relation: 'grandparent' | 'parent' | 'sibling' | 'child' | 'grandchild' | 
            'partner' | 'spouse' | 'lover' | 'ex' | 'friend' | 'best-friend' | 'follower';
  avatar?: number;
  gender: 'male' | 'female' | 'other';
  firstName: string;
  lastName?: string;
  age: number;
  alive?: boolean;
  relationshipScore?: number; // 0-100
  status?: string; // e.g., "Married", "Dating"
}
```

## Store Actions

### spendTimewithFamilyMember(memberId: string)
- Increases relationship score by +5
- Increases happiness by +2
- Searches all relationship arrays (partner, friends, exes, family)
- Logs event: "Spent time with {name}. Relationship +5, Happiness +2."

### giveGiftToFamilyMember(memberId: string, cost: number)
- Increases relationship score by +10
- Costs €100 (or specified amount)
- Checks if player has enough money
- Shows error toast if insufficient funds
- Logs event: "Gave a gift to {name}. Relationship +10, Money -{cost}."

## UI/UX Features

### Section Headers
- Icon + Title + Count badge
- Example: "❤️ Parents [2]"
- Only shown if category has members

### Empty State
- Shown when no relationships exist
- Icon: 👤❌ Account off (64px, grey)
- Title: "No relationships yet"
- Subtitle: "Start building relationships through activities!"

### Visual Feedback
- Toast notifications for all actions
- Success/error messages
- Relationship changes reflected immediately
- Smooth modal animations

### Responsive Design
- Uses `useWindowDimensions` for adaptive layout
- ScrollView with bottom padding for nav bar clearance
- Modal slides up from bottom
- Touch overlay to dismiss modal

## Future Enhancements

### Planned Features:
1. **Relationship History**: Track interaction history over time
2. **Decay System**: Relationships deteriorate without interaction
3. **Conflict System**: Arguments, fights, make-up mechanics
4. **Marriage System**: Propose, wedding, divorce mechanics
5. **Children System**: Pregnancy, birth, parenting actions
6. **Death System**: Aging, funerals, inheritance
7. **Social Events**: Parties, gatherings, family reunions
8. **Gifts Catalog**: Different gift types and costs
9. **Traits System**: Relationship compatibility based on traits
10. **Memory System**: Remember special moments together

### Possible Activities:
- Ask for money (parents/rich friends)
- Borrow money (with debt tracking)
- Start a business together
- Move in together
- Have a baby
- Plan vacation together
- Attend events together
- Introduce to other people
- Set up friends on dates
- Mentor/teach skills

## Integration Points

### Connected Screens:
- **Activities**: Build new relationships
- **Home**: Quick relationship overview
- **Career**: Work contacts becoming friends
- **Education**: Classmates and professors

### Events That Affect Relationships:
- Aging/birthdays
- Major life events (graduation, marriage, etc.)
- Career changes
- Moving cities/countries
- Financial troubles
- Health issues

## Best Practices

### For Players:
1. **Maintain Balance**: Keep high relationships with family
2. **Regular Interaction**: Spend time regularly to maintain bonds
3. **Gift Strategically**: Save gifts for special occasions
4. **Prioritize**: Focus on important relationships first
5. **Watch Death**: Elderly members may pass away

### For Development:
1. **Performance**: Lazy load avatars for large families
2. **Data Persistence**: Save relationship states properly
3. **Validation**: Check member exists before actions
4. **Error Handling**: Graceful fallbacks for missing data
5. **Accessibility**: Proper labels and roles for screen readers

## Color Scheme

- **Primary**: #3b82f6 (Blue) - Section headers, active states
- **Success**: #10b981 (Green) - High relationships, gifts
- **Warning**: #f59e0b (Yellow/Orange) - Medium relationships
- **Danger**: #ef4444 (Red) - Low relationships
- **Grey Scale**: 
  - #1f2937 (Dark) - Primary text
  - #6b7280 (Medium) - Secondary text
  - #9ca3af (Light) - Disabled/deceased
  - #e5e7eb (Very light) - Borders/backgrounds

## Technical Notes

### Performance Considerations:
- Relationship arrays can grow large (100+ members in some families)
- Use FlatList for very large lists (future optimization)
- Cache avatar resolutions
- Memoize relationship calculations

### State Management:
- Relationship data stored in profile object
- Actions update entire profile object
- Zustand handles persistence automatically
- Changes trigger re-renders only for affected components

### Animation:
- Modal: `slide` animation from bottom
- Touch feedback: opacity on press
- Layout: LayoutAnimation for smooth transitions

## Version History
- **v1.0** (Current): Basic relationship viewing and interactions
- **v1.1** (Planned): Relationship decay and conflict system
- **v2.0** (Planned): Marriage, children, and death systems
