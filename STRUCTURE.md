# Project Structure

```
plugin-app/
├── app/                              # Expo Router file-based routes
│   ├── _layout.tsx                   # Root layout (fonts, providers)
│   ├── modal.tsx                     # Global modal route
│   └── (organizer)/                  # Organizer route group
│       ├── _layout.tsx               # Organizer stack navigator
│       ├── edit-event.tsx            # Edit event route
│       ├── event-dashboard.tsx       # Event dashboard route
│       ├── event-insights.tsx        # Event insights route
│       ├── event-preview.tsx         # Event preview route
│       ├── manage-attendees.tsx      # Manage attendees route
│       └── (tabs)/                   # Bottom tab navigator group
│           ├── _layout.tsx           # Tab bar layout
│           ├── account.tsx           # Account tab
│           ├── center-button.tsx     # Center FAB tab button
│           ├── earnings.tsx          # Earnings tab
│           ├── events.tsx            # Events tab
│           └── index.tsx             # Home tab
│
├── components/                       # Shared UI primitives
│   ├── app-safe-area.tsx             # SafeAreaView wrapper
│   ├── back-header.tsx               # Back navigation header
│   ├── custom-bottom-tab.tsx         # Custom tab bar renderer
│   ├── external-link.tsx             # External URL link
│   ├── haptic-tab.tsx                # Tab with haptic feedback
│   ├── parallax-scroll-view.tsx      # Parallax header scroll view
│   ├── screen-view.tsx               # Standard screen wrapper
│   ├── themed-text.tsx               # Text with design-system weights
│   ├── themed-view.tsx               # View with theme support
│   ├── WelcomeHeader.tsx             # Home screen welcome header
│   ├── svgs/                         # SVG icon components
│   │   ├── calendar-alt-icon.tsx
│   │   ├── home-icon.tsx
│   │   ├── money-icon.tsx
│   │   └── user-circle-icon.tsx
│   └── ui/
│       ├── collapsible.tsx           # Expand/collapse section
│       ├── icon-symbol.ios.tsx       # iOS SF Symbol icons
│       └── icon-symbol.tsx           # Cross-platform icon
│
├── constants/                        # App-wide constants
│   ├── fonts.ts                      # Font family names
│   └── theme.ts                      # Color palette & theme tokens
│
├── feature/
│   └── organizer/                    # Organizer feature module
│       ├── constants/
│       │   └── events.ts             # Mock event data & types (ManagedEvent, EventStatus)
│       │
│       ├── home/                     # Home feature
│       │   ├── HomeScreen.tsx
│       │   └── components/           # Home-specific UI components
│       │       ├── index.ts          # Barrel exports
│       │       ├── ChecklistItem.tsx
│       │       ├── CreateActionBottomSheet.tsx
│       │       ├── EventList.tsx
│       │       ├── ResourceCard.tsx
│       │       ├── ResourceList.tsx
│       │       └── SetupChecklist.tsx
│       │
│       ├── events/                   # Events feature
│       │   ├── EditEventScreen.tsx
│       │   ├── EventDashboardScreen.tsx
│       │   ├── EventInsightsScreen.tsx
│       │   ├── EventPreviewScreen.tsx
│       │   ├── ManageAttendeesScreen.tsx  # Thin tab container (~55 lines)
│       │   ├── ManageEventsScreen.tsx
│       │   ├── components/           # Events-specific UI components
│       │   │   ├── index.ts          # Barrel exports
│       │   │   ├── AttendeeRecordCard.tsx
│       │   │   ├── DeleteEventConfirmModal.tsx
│       │   │   ├── DeleteEventSuccessModal.tsx
│       │   │   ├── EditEventField.tsx
│       │   │   ├── EditEventStatusPicker.tsx
│       │   │   ├── EmptyEvents.tsx
│       │   │   ├── EventActionMenu.tsx
│       │   │   ├── EventActionRow.tsx
│       │   │   ├── ManagedEventCard.tsx
│       │   │   ├── MetricCard.tsx
│       │   │   ├── NativeDateTimePicker.tsx  # Date/time picker (Android dialog + iOS Modal)
│       │   │   ├── RichTextEditor.tsx        # Markdown toolbar + multiline TextInput
│       │   │   ├── SalesRecordCard.tsx
│       │   │   ├── SectionTabs.tsx
│       │   │   └── TicketTypeCard.tsx
│       │   ├── hooks/                # Events-specific hooks
│       │   │   ├── index.ts          # Barrel exports
│       │   │   └── useReminderEmailForm.ts  # All reminder form state & send logic
│       │   └── tabs/                 # Tab content components
│       │       ├── AttendeeListTab.tsx       # Search + filter + attendee list
│       │       ├── CheckInSummaryTab.tsx     # Metrics + ticket type breakdown
│       │       └── ReminderEmailsTab.tsx     # Compose & send reminder emails
│       │
│       └── utils/                    # Pure utility functions
│           ├── index.ts              # Barrel exports
│           ├── date-time.ts          # formatDateValue, formatTimeValue
│           └── text-editor.ts        # findLineStart, findLineEnd
│
├── hooks/                            # Global custom hooks
│   ├── use-change-tabs.ts
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── providers/
│   └── ThemeProvider.tsx             # Theme context provider
│
├── assets/
│   ├── fonts/                        # Custom font files
│   ├── images/
│   │   ├── event/                    # Event banner images
│   │   └── home/                     # Home screen images
│   └── svgs/                         # Raw SVG assets
│
├── types/
│   └── icon.ts                       # Icon type definitions
│
├── utils/
│   └── services.ts                   # Shared service utilities
│
├── app.json                          # Expo app config
├── babel.config.js
├── eslint.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
└── STRUCTURE.md                      # This file
```

## Key Conventions

- **Routing**: Expo Router file-based. Screens live in `app/`, business logic lives in `feature/`.
- **Styling**: NativeWind (Tailwind via `className` prop). No `StyleSheet` objects.
- **Icons**: `lucide-react-native` throughout.
- **Safe Area**: Always wrap screens in `<AppSafeArea>` from `@/components/app-safe-area`.
- **Back Navigation**: Use `<BackHeader>` from `@/components/back-header`.
- **Text**: Use `<ThemedText>` with `weight="400" | "500" | "700"` only.
- **Feature modules**: Self-contained under `feature/<name>/` with `components/`, `hooks/`, `utils/`, `events/`.
- **Barrel exports**: Each `feature/organizer/` subfolder has an `index.ts` for clean imports.
