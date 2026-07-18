import { authEn, authFr } from "./modules/auth";
import { eventsEn, eventsFr } from "./modules/events";
import { earningsEn, earningsFr } from "./modules/settings-earnings";
import {
  settingsEn,
  settingsFr,
} from "./modules/settings-earnings";
import {
  homeEn,
  homeFr,
  sharedEn,
  sharedFr,
} from "./modules/home-shared";

export type SupportedLocale = "en" | "fr";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "fr"];

export type TranslationParams = Record<string, string | number>;

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

const baseEn = {
  common: {
    gotIt: "Got it",
    cancel: "Cancel",
    optional: "Optional",
    search: "Search",
    current: "Current",
    comingSoon: "Coming soon",
    partialSupport: "partial support",
    ok: "OK",
    continue: "Continue",
    save: "Save",
    next: "Next",
    back: "Back",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    pleaseWait: "Please wait...",
  },
  tabs: {
    home: "Home",
    events: "Events",
    earnings: "Earnings",
    account: "Account",
  },
  home: {
    welcome: "Welcome {{name}}",
    upcomingEvents: "Upcoming Events",
    currentlyHappening: "Currently Happening",
  },
  account: {
    title: "Account",
    activeOrganization: "Active organization",
    noOrganization: "No organization selected",
    switch: "Switch",
    logOut: "Log Out",
    sections: {
      quickLinks: "Quick Links",
      account: "Account",
      settings: "Settings",
      support: "Support",
      legal: "Legal",
    },
    items: {
      "create-event": "Create event",
      "booked-venues": "Booked Venues",
      "start-campaign": "Start a Campaign",
      "manage-payout": "Manage Payouts",
      "personal-information": "Personal Information",
      "organizer-settings": "Organizer Settings",
      collaborators: "Collaborators",
      notifications: "Notifications",
      "login-security": "Login and Security",
      appearance: "Appearance",
      "privacy-sharing": "Privacy and Sharing",
      translation: "Translation",
      "visit-help-center": "Visit Help Center",
      "send-message": "Send a message",
      terms: "Terms of service",
      privacy: "Privacy Policy",
    },
  },
  translation: {
    title: "Language & Translation",
    subtitle: "Choose your preferred language",
    autoTranslate: "Auto-translate content",
    autoTranslateHint: "Translate event details and messages when available",
    searchPlaceholder: "Search language...",
    noLanguageFound: "No language found",
    languageUpdated: "Language updated",
    languageUpdatedMessage: "Plugin is now set to {{language}}.",
    preferenceSaved: "Preference saved",
    preferenceSavedMessage:
      "{{language}} is saved as your preferred language. Full app translation is coming soon — the interface will stay in English for now.",
  },
  privacy: {
    title: "Privacy and Sharing",
    controlTitle: "You control your data",
    controlDescription:
      "Manage what others can see and how your information is used across Plugin.",
    visibility: "Visibility",
    dataSharing: "Data & sharing",
    publicProfile: "Public profile",
    publicProfileDescription:
      "Allow other organizers and attendees to view your organizer profile and public event listings.",
    activityStatus: "Activity status",
    activityStatusDescription:
      "Show when you are active on Plugin, such as recently published events or check-ins.",
    marketingEmails: "Marketing emails",
    marketingEmailsDescription:
      "Receive updates on upcoming features, promotions, and event industry tips.",
    thirdPartySharing: "Third-party sharing",
    thirdPartySharingDescription:
      "Allow trusted partners to receive limited data for enhanced services and offers.",
    personalizedRecommendations: "Personalized recommendations",
    personalizedRecommendationsDescription:
      "Use your activity to suggest venues, tools, and events that match your interests.",
    usageAnalytics: "Usage analytics",
    usageAnalyticsDescription:
      "Help us improve Plugin by sharing anonymous usage data about how you use the app.",
    downloadData: "Download my data",
    downloadDataDescription: "Request a copy of your personal information",
    privacyPolicy: "Privacy Policy",
    privacyPolicyDescription: "Read how we collect and protect your data",
    downloadRequestedTitle: "Data export requested",
    downloadRequestedMessage:
      "We'll prepare your data and email a download link to your account email within 48 hours.",
    managePreferences: "Manage privacy preferences",
    managePreferencesDescription:
      "Control visibility, sharing, and marketing settings",
  },
  sendMessage: {
    title: "New Message",
    composeEmail: "Compose email",
    composeHint: "Tap send to open your phone's mail app",
    from: "From",
    to: "To",
    subject: "Subject",
    message: "Message",
    subjectPlaceholder: "What do you need help with?",
    messagePlaceholder: "Write your message here...",
    addEmailInProfile: "Add your email in profile",
    responseTime:
      "We typically respond within 1–2 business days. Include your event name or order details if relevant.",
    openInMailApp: "Open in mail app",
    noMailAppTitle: "No mail app found",
    noMailAppMessage:
      "Install a mail app (Gmail, Outlook, etc.) or email us at {{email}}.",
  },
} satisfies TranslationTree;

const baseFr = {
  common: {
    gotIt: "Compris",
    cancel: "Annuler",
    optional: "Facultatif",
    search: "Rechercher",
    current: "Actuel",
    comingSoon: "Bientôt disponible",
    partialSupport: "prise en charge partielle",
    ok: "OK",
    continue: "Continuer",
    save: "Enregistrer",
    next: "Suivant",
    back: "Retour",
    close: "Fermer",
    confirm: "Confirmer",
    loading: "Chargement...",
    pleaseWait: "Veuillez patienter...",
  },
  tabs: {
    home: "Accueil",
    events: "Événements",
    earnings: "Revenus",
    account: "Compte",
  },
  home: {
    welcome: "Bienvenue {{name}}",
    upcomingEvents: "Événements à venir",
    currentlyHappening: "En cours",
  },
  account: {
    title: "Compte",
    activeOrganization: "Organisation active",
    noOrganization: "Aucune organisation sélectionnée",
    switch: "Changer",
    logOut: "Se déconnecter",
    sections: {
      quickLinks: "Liens rapides",
      account: "Compte",
      settings: "Paramètres",
      support: "Assistance",
      legal: "Mentions légales",
    },
    items: {
      "create-event": "Créer un événement",
      "booked-venues": "Lieux réservés",
      "start-campaign": "Lancer une campagne",
      "manage-payout": "Gérer les paiements",
      "personal-information": "Informations personnelles",
      "organizer-settings": "Paramètres organisateur",
      collaborators: "Collaborateurs",
      notifications: "Notifications",
      "login-security": "Connexion et sécurité",
      appearance: "Apparence",
      "privacy-sharing": "Confidentialité et partage",
      translation: "Traduction",
      "visit-help-center": "Centre d'aide",
      "send-message": "Envoyer un message",
      terms: "Conditions d'utilisation",
      privacy: "Politique de confidentialité",
    },
  },
  translation: {
    title: "Langue et traduction",
    subtitle: "Choisissez votre langue préférée",
    autoTranslate: "Traduction automatique",
    autoTranslateHint:
      "Traduire les détails d'événements et les messages lorsque disponible",
    searchPlaceholder: "Rechercher une langue...",
    noLanguageFound: "Aucune langue trouvée",
    languageUpdated: "Langue mise à jour",
    languageUpdatedMessage: "Plugin est maintenant en {{language}}.",
    preferenceSaved: "Préférence enregistrée",
    preferenceSavedMessage:
      "{{language}} est enregistré comme langue préférée. La traduction complète de l'application arrive bientôt — l'interface restera en anglais pour l'instant.",
  },
  privacy: {
    title: "Confidentialité et partage",
    controlTitle: "Vous contrôlez vos données",
    controlDescription:
      "Gérez ce que les autres peuvent voir et comment vos informations sont utilisées sur Plugin.",
    visibility: "Visibilité",
    dataSharing: "Données et partage",
    publicProfile: "Profil public",
    publicProfileDescription:
      "Permettre aux autres organisateurs et participants de voir votre profil et vos événements publics.",
    activityStatus: "Statut d'activité",
    activityStatusDescription:
      "Afficher quand vous êtes actif sur Plugin, par exemple vos événements publiés ou vos enregistrements.",
    marketingEmails: "E-mails marketing",
    marketingEmailsDescription:
      "Recevoir des mises à jour sur les nouvelles fonctionnalités, promotions et conseils événementiels.",
    thirdPartySharing: "Partage avec des tiers",
    thirdPartySharingDescription:
      "Autoriser des partenaires de confiance à recevoir des données limitées pour des services et offres améliorés.",
    personalizedRecommendations: "Recommandations personnalisées",
    personalizedRecommendationsDescription:
      "Utiliser votre activité pour suggérer des lieux, outils et événements adaptés à vos intérêts.",
    usageAnalytics: "Analyses d'utilisation",
    usageAnalyticsDescription:
      "Nous aider à améliorer Plugin en partageant des données d'utilisation anonymes.",
    downloadData: "Télécharger mes données",
    downloadDataDescription:
      "Demander une copie de vos informations personnelles",
    privacyPolicy: "Politique de confidentialité",
    privacyPolicyDescription:
      "Lire comment nous collectons et protégeons vos données",
    downloadRequestedTitle: "Export de données demandé",
    downloadRequestedMessage:
      "Nous préparerons vos données et enverrons un lien de téléchargement à votre e-mail sous 48 heures.",
    managePreferences: "Gérer les préférences de confidentialité",
    managePreferencesDescription:
      "Contrôler la visibilité, le partage et les paramètres marketing",
  },
  sendMessage: {
    title: "Nouveau message",
    composeEmail: "Rédiger un e-mail",
    composeHint:
      "Appuyez sur envoyer pour ouvrir l'application mail de votre téléphone",
    from: "De",
    to: "À",
    subject: "Objet",
    message: "Message",
    subjectPlaceholder: "De quoi avez-vous besoin ?",
    messagePlaceholder: "Écrivez votre message ici...",
    addEmailInProfile: "Ajoutez votre e-mail dans le profil",
    responseTime:
      "Nous répondons généralement sous 1 à 2 jours ouvrables. Incluez le nom de votre événement ou les détails de commande si pertinent.",
    openInMailApp: "Ouvrir dans l'application mail",
    noMailAppTitle: "Aucune application mail trouvée",
    noMailAppMessage:
      "Installez une application mail (Gmail, Outlook, etc.) ou écrivez-nous à {{email}}.",
  },
} satisfies TranslationTree;

const en = {
  ...baseEn,
  ...authEn,
  ...eventsEn,
  ...earningsEn,
  ...settingsEn,
  ...homeEn,
  ...sharedEn,
};

const fr = {
  ...baseFr,
  ...authFr,
  ...eventsFr,
  ...earningsFr,
  ...settingsFr,
  ...homeFr,
  ...sharedFr,
};

export const translations = { en, fr } as const;

export type TranslationKey = keyof typeof translations;

export function resolveLocale(languageCode: string): SupportedLocale {
  return languageCode === "fr" ? "fr" : "en";
}

function getNestedValue(
  tree: TranslationTree,
  path: string,
): string | undefined {
  const value = path.split(".").reduce<string | TranslationTree | undefined>(
    (acc, part) => {
      if (typeof acc === "string" || acc === undefined) {
        return acc;
      }
      return acc[part];
    },
    tree,
  );

  return typeof value === "string" ? value : undefined;
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`,
  );
}

export function translate(
  locale: SupportedLocale,
  key: string,
  params?: TranslationParams,
): string {
  const localized = getNestedValue(translations[locale], key);
  if (localized) {
    return interpolate(localized, params);
  }

  const fallback = getNestedValue(translations.en, key);
  if (fallback) {
    return interpolate(fallback, params);
  }

  return key;
}
