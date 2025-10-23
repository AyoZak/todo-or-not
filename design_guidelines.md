# Design Guidelines: AI-Enhanced Task Manager

## Design Approach: Productivity-First System

**Selected Approach:** Design System (Material Design principles) with inspiration from Linear and Notion
**Justification:** This is a utility-focused productivity tool requiring efficiency, clarity, and consistent patterns for rapid task management. The complex interactions (drag-and-drop, time tracking, AI integration) benefit from established design patterns.

**Key Design Principles:**
- Information density without clutter
- Instant visual feedback for all interactions
- Scannable hierarchy for quick task assessment
- Minimal cognitive load during rapid task entry

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 222 10% 10% (deep charcoal)
- Surface: 222 10% 14% (elevated panels for lists)
- Surface Elevated: 222 10% 18% (task cards)
- Border: 222 8% 25% (subtle dividers)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%

**Accent Colors:**
- Primary Action: 217 91% 60% (vibrant blue for AI enhance button)
- Success: 142 71% 45% (time tracking active state)
- Warning: 38 92% 50% (pause state)
- Destructive: 0 72% 51% (delete actions)

**Task Color Coding System:**
Provide 6 preset color options for task organization (applied as left border accent on task cards):
- Purple: 270 70% 65%
- Blue: 217 91% 60%
- Green: 142 71% 45%
- Orange: 25 95% 53%
- Red: 0 72% 51%
- Pink: 330 81% 60%

### B. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts CDN)
- Monospace: 'JetBrains Mono', monospace (for time displays)

**Type Scale:**
- List Titles: text-lg font-semibold (18px)
- Task Titles: text-base font-medium (16px)
- Task Details: text-sm (14px)
- Time Counters: text-sm font-mono font-medium
- UI Labels: text-xs font-medium uppercase tracking-wide (11px)
- Buttons: text-sm font-medium

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8 consistently
- Component padding: p-4, p-6
- Stack spacing: space-y-3, space-y-4
- Inline spacing: space-x-2, space-x-3
- Section gaps: gap-4, gap-6

**Grid Structure:**
- Horizontal list layout: `flex flex-row gap-6 overflow-x-auto`
- Each list: Fixed width `w-80` (320px) for consistent scanning
- Task grid within list: `flex flex-col gap-3`
- Single-screen viewport with horizontal scroll for multiple lists

### D. Component Library

**List Container:**
- Background: Surface color with subtle border
- Border radius: rounded-lg
- Padding: p-4
- Header with list title, time counter, and actions
- Scrollable task area with drag-drop zone
- Footer with "Add Task" button

**Task Card:**
- Background: Surface Elevated
- Border radius: rounded-md
- Left border accent (4px) for color coding
- Padding: p-4
- Sections: Title area, details (expandable), action buttons row
- Hover state: Subtle brightness increase + shadow-md
- Drag handle: 6 dots icon (from Heroicons) with opacity-40

**AI Enhancement Button:**
- Primary position: Top-right of task card
- Icon: Sparkles (Heroicons) + "Enhance" label
- Dropdown menu appears below on click
- Menu items: 4 enhancement options with clear labels
- Visual indicator when AI processing (spinning icon)

**Time Tracking Controls:**
- Compact button group: Start (play icon), Pause (pause icon), Finish (check icon)
- Active timer: Green glow effect on start button
- Time display: Monospace font in format "00:00:00"
- List total: Prominent display in list header

**Navigation & Actions:**
- Top bar: App title "TaskFlow AI" (left), "New List" button (right)
- Delete buttons: Small, ghost style, red on hover
- Color picker: 6 color swatches in horizontal row

**Drag-and-Drop Feedback:**
- Dragging task: opacity-50 + shadow-xl + slight rotation (rotate-2)
- Drop zone highlight: dashed border (border-dashed) + background tint
- Valid drop area: border-primary-500
- Invalid drop area: border-gray-600

### E. Interactions & States

**Animation Strategy:** Minimal, purposeful animations only
- Task drag: transform transitions (150ms ease-out)
- Dropdown menus: slide-down fade-in (100ms)
- Time counter updates: no animation (instant updates for clarity)
- AI processing: subtle pulse on enhance button

**Micro-interactions:**
- Button hover: slight scale (scale-105) + brightness increase
- Task card hover: elevation change (shadow-sm to shadow-md)
- Color selection: border highlight on selected color
- Checkbox/toggle states: instant visual feedback

---

## Layout Specifications

**Single-Screen Layout:**
- Fixed header: h-14 with dark background
- Main content area: Full height minus header, horizontal scrolling
- Lists arranged left-to-right with gap-6
- First list (default) always visible on load
- Scroll indicator: Subtle gradient fade at right edge when more lists exist

**Task Card Structure:**
```
┌─────────────────────────────┐
│ [Drag] Title     [Enhance ▼]│
│ ────────────────────────────│
│ Details (click to expand)   │
│ Original: [preserved text]  │
│ ────────────────────────────│
│ [⏱ 00:05:30] [▶] [⏸] [✓]   │
│ [🎨 Colors] [🗑]             │
└─────────────────────────────┘
```

**Responsive Behavior:**
- Desktop (1024px+): Show 3-4 lists simultaneously
- Tablet (768px): Show 2 lists
- Mobile (640px): Show 1 list, swipe to navigate

---

## Accessibility & Usability

- All interactive elements: min-height of h-10 (40px) for easy clicking
- Color coding supplemented with icons/labels (not color alone)
- Keyboard shortcuts: Enter to add task, Esc to close menus
- Focus indicators: 2px ring offset with primary color
- Screen reader labels for icon-only buttons
- Time displays always visible (no hover-only states)

---

## Images

**No hero images needed** - This is a utility application focused on productivity. All visual elements are UI components and icons.

**Icons:** Use Heroicons (via CDN) throughout:
- Sparkles: AI enhancement
- Clock: Time tracking
- Play/Pause/Check: Timer controls
- Plus: Add actions
- Trash: Delete
- Dots vertical: Drag handle
- Chevron down: Dropdowns