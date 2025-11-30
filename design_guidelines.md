# Design Guidelines: HearTrack Hearing Journal Web App

## Design Approach

**Selected System:** Material Design 3 with Healthcare Adaptations
**Rationale:** Medical applications require trustworthy, accessible, and clarity-focused design. Material Design provides robust patterns for data-heavy interfaces while maintaining a clean, professional aesthetic essential for healthcare contexts.

**Core Design Principles:**
1. Trust through clarity - no ambiguous UI elements
2. Medical professionalism - calm, reassuring visual language
3. Progress-oriented - celebrate milestones and journey
4. Accessibility-first - high contrast, clear typography

## Typography

**Font Family:** Inter (Google Fonts)
- Primary: Inter (400, 500, 600, 700)
- Fallback: system-ui, sans-serif

**Type Scale:**
- Hero/Display: text-4xl to text-5xl (36-48px), font-bold
- Page Headings: text-3xl (30px), font-semibold
- Section Headings: text-2xl (24px), font-semibold
- Card Titles: text-xl (20px), font-medium
- Body Text: text-base (16px), font-normal
- Supporting Text: text-sm (14px), font-normal
- Labels/Captions: text-xs (12px), font-medium, uppercase tracking-wide

**Line Height:** Generous - use leading-relaxed for body text, leading-tight for headings

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing: p-2, gap-2 (buttons, icons)
- Component padding: p-4, p-6 (cards, forms)
- Section spacing: py-8, py-12, py-16 (page sections)
- Large gutters: gap-8, gap-12 (grids, layouts)

**Grid System:**
- Container: max-w-7xl mx-auto px-4
- Main content area: max-w-4xl for forms/journal
- Two-column layouts: grid-cols-1 md:grid-cols-2 with gap-6 to gap-8
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6

## Component Library

### Authentication Pages (Register/Login/Forgot Password)
- Centered card layout: max-w-md mx-auto
- Split-screen optional: Left side with medical imagery/gradient, right side with form
- Form fields: Generous padding (p-4), rounded-lg borders
- Input groups: Stack with gap-4
- CTAs: Full-width primary buttons with h-12
- Guardian fields: Clearly separated with subtle border-t and pt-6

### Onboarding Flow
- Step indicator at top: Horizontal progress dots or numbered steps
- Question cards: Centered, max-w-xl, with generous padding (p-8 to p-12)
- Date pickers: Large, touch-friendly calendar interfaces
- Continue button: Sticky bottom on mobile, centered on desktop

### Hearing Age Counter (Hero Element)
- Prominent circular progress visualization: 200-300px diameter on desktop, 180px mobile
- Positioned at top of journal page with py-12 to py-16 spacing
- Day count inside circle: Large text-4xl to text-5xl, font-bold
- Subtitle below: "of your Hearing Journey" in text-lg, font-medium
- Optional: Subtle radial gradient background for the section

### Milestone Calendar
- Full-width calendar component with rounded borders
- Month view with clear date cells (min h-16 for click targets)
- Visual markers: Distinctive badges/icons for Surgery (medical cross), Activation (sound wave), Appointments (calendar check)
- Legend below calendar: Horizontal list explaining markers with gap-6
- Mobile: Consider week view or condensed month view

### Appointment Registration Modal
- Modal overlay: Fixed, centered, max-w-2xl
- Header: Sticky with title and close button
- Form sections: Separated with gap-6
- Date picker: Inline calendar or dropdown
- Doctor/Notes: textarea with rows-4
- Upload area: Dashed border, h-32, with upload icon and "Drag or click to upload" text
- Success feedback: Toast notification or inline green success message with checkmark
- Action buttons: Flexbox with gap-4, cancel (outline) and submit (solid)

### Survey Cards Grid
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Each card: Rounded-xl, border, p-6, hover:shadow-lg transition
- Card structure: Icon (top), title (text-lg font-semibold), description (text-sm), arrow icon (bottom-right)
- Interactive states: Hover lifts card slightly (transform scale-105)
- 4-6 survey cards minimum for visual balance

### Daily Tips Section
- Horizontal carousel on mobile, grid on desktop
- Tip cards: rounded-lg, p-6, with icon, heading, and short text
- Background: Subtle gradient or soft tint to differentiate from main content
- Navigation: Dots indicator or arrow buttons

### Gen 2 Device Page (Locked State)
- Full-page overlay with semi-transparent backdrop
- Central card: "Gen 2 Hardware Coming Soon"
- Icon: Large (w-24 h-24) bluetooth or device icon
- Messaging: text-xl heading, text-base description with expected timeline
- CTA: "Join Waitlist" or "Notify Me" button
- Behind overlay: Show disabled/grayed-out controls for preview

### Navigation
- Top navbar: Sticky, border-b, h-16
- Logo/brand left, nav links center, user menu right
- Active state: Border-b-2 indicator under current page
- Mobile: Hamburger menu with slide-out drawer

## Accessibility
- Minimum touch targets: 44x44px (h-12 for buttons)
- Form labels: Always visible, not just placeholders
- Focus states: Distinct outline ring with ring-2 ring-offset-2
- Calendar keyboard navigation: Arrow keys to move between dates
- Error states: Text + icon + border treatment

## Images

**No large hero image needed** - This is a utility-focused application where the Hearing Age Counter serves as the visual anchor.

**Images to Include:**
1. **Auth pages background** (optional): Soft, abstract medical imagery or calming gradient - if used, keep it subtle and non-distracting
2. **Empty states**: Friendly illustrations for "No appointments yet" or "No surveys available"
3. **Icon system**: Use Lucide-React consistently - Calendar, Upload, User, Heart, Stethoscope, Activity, CheckCircle, AlertCircle

**Audiogram uploads**: Display as thumbnail previews with zoom capability

## Animations

**Minimal and purposeful only:**
- Page transitions: Simple fade or slide
- Modal entry: Scale and fade in
- Success states: Checkmark animation on upload complete
- No decorative animations - medical context requires stability

## Visual Tone

- Clean, spacious layouts with breathing room
- High contrast for readability (WCAG AA minimum)
- Rounded corners (rounded-lg to rounded-xl) for approachability
- Subtle shadows for depth, never dramatic
- Progress and achievement celebrated through clear visual feedback
- Medical professionalism maintained throughout