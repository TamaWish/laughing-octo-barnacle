# Settings Flow - Visual Guide

## 🎯 Complete User Journey

### 1️⃣ **Profile Card with Settings Button**

```
┌────────────────────────────────────────────┐
│ ┌──────────────────────────────────────┐   │
│ │ [👤] Dakota Garcia            [⚙️]  │   │ ← Click here!
│ │      Age 19 • 🇫🇷                   │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ École Maternelle... — 2 yr           │   │
│ │ [████████████░░░░] 60%              │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ 😊 62%   ❤️ 78%   💰 $2,780        │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ [Advance Year]  [Education]          │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

---

### 2️⃣ **Settings Modal Opens**

```
┌────────────────────────────────────────────┐
│                                            │
│           ⚙️ Settings                      │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  💾  Save Game                       │ │ ← Click to save
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  📂  Load Game                       │ │ ← Click to load
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Close                               │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

### 3️⃣ **Option A: Save Game**

**User clicks "💾 Save Game"**

```
┌────────────────────────────────────────────┐
│                                            │
│  ✅ Game Saved                            │
│  Progress has been saved successfully      │
│                                            │
└────────────────────────────────────────────┘
           ↓
    Modal closes automatically
    New save created:
    "Save 10/17/2025, 3:45:23 PM"
```

---

### 3️⃣ **Option B: Load Game**

**User clicks "📂 Load Game"**

```
┌────────────────────────────────────────────┐
│                                            │
│           📂 Load Game                     │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  🔃  Refresh Saves                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Save 10/17/2025, 3:45:23 PM         │ │
│  │  Dakota - Age 19                     │ │
│  │              [Load]  [Delete]        │ │ ← Actions
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Save 10/16/2025, 10:22:15 AM        │ │
│  │  Dakota - Age 18                     │ │
│  │              [Load]  [Delete]        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Save 10/15/2025, 8:30:45 PM         │ │
│  │  Dakota - Age 17                     │ │
│  │              [Load]  [Delete]        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Close                               │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

### 4️⃣ **Loading a Save**

**User clicks green "Load" button**

```
┌────────────────────────────────────────────┐
│                                            │
│  ✅ Game Loaded                           │
│  Save file loaded successfully             │
│                                            │
└────────────────────────────────────────────┘
           ↓
    Game state restored
    Modal closes
    You're back to Age 18!
```

---

### 4️⃣ **Deleting a Save**

**User clicks red "Delete" button**

```
┌────────────────────────────────────────────┐
│                                            │
│  ⚠️ Delete Save                           │
│                                            │
│  Are you sure you want to delete this      │
│  save file? This action cannot be undone.  │
│                                            │
│       [Cancel]        [Delete]             │
│                                            │
└────────────────────────────────────────────┘
           ↓
    User confirms
           ↓
    Save removed from list
```

---

### 5️⃣ **Empty State**

**When no saves exist:**

```
┌────────────────────────────────────────────┐
│                                            │
│           📂 Load Game                     │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  🔃  Refresh Saves                   │ │
│  └──────────────────────────────────────┘ │
│                                            │
│                                            │
│         No saved games found               │
│                                            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Close                               │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🎨 Color Coding

### Buttons
- **Blue** (`#3b82f6`) - Primary actions (Save, Refresh)
- **Green** (`#10b981`) - Load action
- **Red** (`#ef4444`) - Delete action
- **Gray** (`#f3f4f6`) - Close/Cancel

### Toast Notifications
- **✅ Success** - Green with checkmark
- **❌ Error** - Red with X
- **ℹ️ Info** - Blue with info icon

---

## 📱 Interaction Patterns

### Modal Behavior
- **Presentation**: Slide up from bottom
- **Style**: Page sheet (iOS style)
- **Dismissal**: Tap Close or complete action
- **Background**: White with padding

### Feedback
- **Immediate**: Button press visual feedback
- **Success**: Toast notification + auto-close
- **Error**: Toast notification + modal stays open
- **Destructive**: Confirmation alert

---

## ⚡ Quick Actions Summary

| Action | Steps | Result |
|--------|-------|--------|
| **Save Game** | Settings → Save Game | New save created, modal closes |
| **Load Game** | Settings → Load Game → Select → Load | Game restored, modal closes |
| **Delete Save** | Settings → Load Game → Select → Delete → Confirm | Save removed |
| **Refresh List** | Settings → Load Game → Refresh Saves | List updates |
| **Cancel** | Tap Close or back | Modal closes |

---

## 🎯 Key Features

### ✨ What Makes It Great

1. **Quick Access**
   - Settings always visible in profile
   - One tap to save/load

2. **Clear Actions**
   - Icons + text labels
   - Color-coded buttons
   - Obvious hierarchy

3. **Safety**
   - Confirmation for delete
   - Can't accidentally delete
   - Error handling built-in

4. **Information Rich**
   - Save name with timestamp
   - Character name visible
   - Age shown for context

5. **Smooth Experience**
   - Animations feel natural
   - Toasts provide feedback
   - Auto-close on success

---

## 🔄 Auto-save

**Works automatically in the background:**

```
Game State Changes
      ↓
Auto-save Triggered
      ↓
Current Save Updated
      ↓
(Silent - no UI shown)
```

**When it saves:**
- After advancing year
- After major events
- After education changes
- After significant stat changes

**Note**: Only works if you've manually saved at least once to create a "current save"
