export type AccountIconName =
  | "list"
  | "sparkles"
  | "wallet"
  | "user"
  | "settings"
  | "users"
  | "bell"
  | "shield"
  | "shield-check"
  | "languages"
  | "circle-help"
  | "send"
  | "file"
  | "file-lock"
  | "sun-moon"
  | "building";

export type AccountMenuItem = {
  key: string;
  label: string;
  icon: AccountIconName;
  route?:
    | "/(organizer)/profile-information"
    | "/(organizer)/login-security"
    | "/(organizer)/notification-settings"
    | "/(organizer)/start-campaign"
    | "/(organizer)/help-center"
    | "/(organizer)/send-message"
    | "/(organizer)/terms-of-service"
    | "/(organizer)/privacy-policy"
    | "/(organizer)/privacy-sharing"
    | "/(organizer)/appearance"
    | "/(organizer)/organizer-settings"
    | "/(organizer)/booked-venues"
    | "/(organizer)/collaborators"
    | "/(organizer)/translation"
    | "/(organizer)/create-event"
    | "/(organizer)/(tabs)/earnings";
};

export type AccountMenuSection = {
  title: string;
  sectionKey: "quickLinks" | "account" | "settings" | "support" | "legal";
  items: AccountMenuItem[];
};

export type DeviceSession = {
  id: string;
  device: string;
  lastSeen: string;
};

export const ACCOUNT_SECTIONS: AccountMenuSection[] = [
  {
    title: "Quick Links",
    sectionKey: "quickLinks",
    items: [
      { key: "create-event", label: "Create event", icon: "list",
        route: "/(organizer)/create-event"

       },
      {
        key: "booked-venues",
        label: "Booked Venues",
        icon: "building",
        route: "/(organizer)/booked-venues",
      },
      {
        key: "start-campaign",
        label: "Start a Campaign",
        icon: "sparkles",
        route: "/(organizer)/start-campaign",
      },
      {
        key: "manage-payout",
        label: "Manage Payouts",
        icon: "wallet",
        route: "/(organizer)/(tabs)/earnings",
      },
    ],
  },
  {
    title: "Account",
    sectionKey: "account",
    items: [
      {
        key: "personal-information",
        label: "Personal Information",
        icon: "user",
        route: "/(organizer)/profile-information",
      },
      {
        key: "organizer-settings",
        label: "Organizer Settings",
        icon: "settings",
        route: "/(organizer)/organizer-settings",
      },
      {
        key: "collaborators",
        label: "Collaborators",
        icon: "users",
        route: "/(organizer)/collaborators",
      },
    ],
  },
  {
    title: "Settings",
    sectionKey: "settings",
    items: [
      {
        key: "notifications",
        label: "Notifications",
        icon: "bell",
        route: "/(organizer)/notification-settings",
      },
      {
        key: "login-security",
        label: "Login and Security",
        icon: "shield",
        route: "/(organizer)/login-security",
      },
      {
        key: "appearance",
        label: "Appearance",
        icon: "sun-moon",
        route: "/(organizer)/appearance",
      },
      {
        key: "privacy-sharing",
        label: "Privacy and Sharing",
        icon: "shield-check",
        route: "/(organizer)/privacy-sharing",
      },
      {
        key: "translation",
        label: "Translation",
        icon: "languages",
        route: "/(organizer)/translation",
      },
    ],
  },
  {
    title: "Support",
    sectionKey: "support",
    items: [
      {
        key: "visit-help-center",
        label: "Visit Help Center",
        icon: "circle-help",
        route: "/(organizer)/help-center",
      },
      { key: "send-message", label: "Send a message", icon: "send", route: "/(organizer)/send-message" },
    ],
  },
  {
    title: "Legal",
    sectionKey: "legal",
    items: [
      {
        key: "terms",
        label: "Terms of service",
        icon: "file",
        route: "/(organizer)/terms-of-service",
      },
      {
        key: "privacy",
        label: "Privacy Policy",
        icon: "file-lock",
        route: "/(organizer)/privacy-policy",
      },
    ],
  },
];

export const DEVICE_SESSIONS: DeviceSession[] = [
  {
    id: "d1",
    device: "OS X 10.15.7",
    lastSeen: "August 11, 2023 at 10:03 PM",
  },
  {
    id: "d2",
    device: "OS X 10.15.7",
    lastSeen: "August 11, 2023 at 10:03 PM",
  },
  {
    id: "d3",
    device: "OS X 10.15.7",
    lastSeen: "August 11, 2023 at 10:03 PM",
  },
  {
    id: "d4",
    device: "OS X 10.15.7",
    lastSeen: "August 11, 2023 at 10:03 PM",
  },
];
