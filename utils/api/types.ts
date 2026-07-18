// ─── Auth ─────────────────────────────────────────────────────────────────────

export type AuthUser = {
  _id: string;
  __v?: number;
  email: string;
  name: {
    firstname: string;
    lastname: string;
  };
  contact: {
    phone: string;
    country: string;
  };
  role: string;
  platform: string;
  status: boolean;
  isEmailVerified: boolean;
  isOrganizer: boolean;
  isSocialMediaLogin: boolean;
  favorites: string[];
  wallet: number;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
};

export type RegisterStep1Response = {
  otpId?: string;
};

/** auth/sign-up-two — token is merged into the user object by the api-client */
export type RegisterStep2Response = AuthUser & { token: string };

export type LoginStep1Response = {
  otpId?: string;
  userId?: string;
};

/** auth/login-step-two — token is merged into the user object by the api-client */
export type LoginStep2Response = AuthUser & { token: string };

export type SignedUrlResponse = {
  signedUrl: string;
  publicUrl: string;
};

// ─── Events ───────────────────────────────────────────────────────────────────

export type EntryTicket = {
  ticketName: string;
  ticketPrice: number;
  ticketQuantity: number;
  ticketsSold?: number;
};

export type GroupedTicket = {
  id: string;
  ticketName: string;
  ticketPrice: number;
  ticketQuantity: number;
  ticketsSold?: number;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  coverPhoto: string;
  photos?: string[];
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  entryTicket?: EntryTicket;
  groupedTicket?: GroupedTicket[];
  status: "upcoming" | "live" | "past";
  isFeatured?: boolean;
  agendas?: unknown[];
  vendors?: unknown[];
  guests?: unknown[];
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type EventFilters = {
  page?: number;
  limit?: number;
  category?: string;
  status?: "upcoming" | "live" | "past";
};

export type EventFilterQuery = {
  search?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type CreateEventPayload = {
  name: string;
  description: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  coverPhoto: string;
  entryTicket?: {
    ticketName: string;
    ticketPrice: number;
    ticketQuantity: number;
  };
};

// ─── New typed payloads matching the real API ─────────────────────────────────

export type CreateEventBasicPayload = {
  userId: string;
  eventName: string;
  eventDescription: string;
  eventBanner?: string;
  thumbnail?: string;
  organizerId?: string;
};

export type OneTimeEventPayload = {
  startDate: string; // ISO string
  endDate: string; // ISO string
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  timeZone?: string;
};

export type PhysicalLocationPayload = {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  zipcode?: string;
};

export type OnlineLocationPayload = {
  onlineVenue?: string;
  venueLink?: string;
};

export type EntryTicketApiPayload = {
  entryTicketType: "paid" | "free" | "donation";
  ticketName: string;
  ticketPrice?: number;
  ticketQuantity: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  ticketPeaks?: string;
};

export type GroupedTicketApiPayload = {
  groupedTicketType: "paid" | "free" | "donation";
  ticketCategory: string;
  ticketName: string;
  ticketPrice?: number;
  ticketQuantity: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  ticketPeaks?: string;
};

export type AgendaPayload = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  host?: { name: string; photo?: string };
};

export type RawAgenda = AgendaPayload & {
  _id: string;
  eventId: string;
  createdAt?: string;
};

export type GuestPayload = {
  name: string;
  role?: string;
  photo?: string;
};

export type RawGuest = GuestPayload & {
  _id: string;
  eventId: string;
};

export type AgentTicket = {
  ticketId: string;
  ticketName: string;
};

export type AddAgentPayload = {
  event: string;
  email: string;
  tickets: AgentTicket[];
};

export type RawAgent = {
  _id: string;
  email: string;
  event: string;
  tickets: AgentTicket[];
  __v?: number;
};

export type VendorPayload = {
  thumbnail?: string;
  slots: number;
  isPass?: string;
  passCategory?: string[];
  price?: number;
  vendorTag?: string;
};

export type RawVendor = VendorPayload & {
  _id: string;
  eventId: string;
};

export type UpdateEventPayload = {
  eventName?: string;
  eventDescription?: string;
  eventBanner?: string;
  thumbnail?: string;
  eventCategory?: string[];
  eventType?: "one-time" | "recurring";
  oneTimeEvent?: OneTimeEventPayload;
  locationType?: "physical" | "online";
  physicalLocation?: PhysicalLocationPayload;
  onlineLocation?: OnlineLocationPayload;
  eventAgendas?: unknown[];
  groupedTicket?: GroupedTicketApiPayload[];
  isPublished?: boolean;
  publishStatus?: "public" | "private";
  refundPolicyAgreed?: boolean;
  eventPhotos?: string[];
  ticketCategory?: string;
  entryTicket?: EntryTicketApiPayload;
};

export type RawEntryTicket = {
  _id: string;
  entryTicketType: "paid" | "free" | "donation";
  ticketName: string;
  ticketPrice?: number;
  ticketQuantity?: number;
  ticketsSold?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  ticketPeaks?: string;
  ticketSaleActive?: boolean;
};

export type RawGroupedTicket = {
  _id: string;
  entryTicketType?: "paid" | "free" | "donation";
  ticketName: string;
  ticketPrice?: number;
  ticketQuantity?: number;
  ticketsSold?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  ticketPeaks?: string;
  ticketSaleActive?: boolean;
};

export type RawEvent = {
  _id: string;
  userId: string;
  eventName: string;
  eventDescription?: string;
  eventBanner?: string;
  thumbnail?: string;
  eventCategory?: string[];
  eventType?: string;
  // flat date/time fields (top-level in API response)
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  // flat location fields
  address?: string;
  locationType?: string;
  // nested shapes still used when creating/patching
  oneTimeEvent?: OneTimeEventPayload;
  physicalLocation?: PhysicalLocationPayload;
  onlineLocation?: OnlineLocationPayload;
  isPublished: boolean;
  eventStatus?: boolean;
  activeStatus?: boolean;
  balance?: number;
  ticketPrice?: number;
  refundPolicyAgreed?: boolean;
  eventPhotos?: string[];
  entryTicket?: RawEntryTicket;
  groupedTicket?: RawGroupedTicket[];
  createdAt?: string;
  updatedAt?: string;
};

// ─── Tickets ──────────────────────────────────────────────────────────────────

export type Ticket = {
  id: string;
  _id: string;
  ticketNumber: string;
  eventId: string;
  eventName: string;
  ticketData: {
    name: string;
    price: number;
    quantity?: number;
  };
  holderInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  qrCode?: string;
  status: "pending" | "confirmed" | "complimentary" | "refunded";
  checkedIn: boolean;
  purchaseDate: string;
};

export type ScanTicketResponse = {
  ticket: Ticket;
  alreadyCheckedIn: boolean;
};

export type EventAttendee = {
  _id?: string;
  id?: string;
  email?: string;
  holderInfo?: {
    email?: string;
    name?: string;
  };
  attendeeEmail?: string;
  ticketName?: string;
  ticketData?: {
    name?: string;
  };
  checkedIn?: boolean;
  status?: string;
  purchaseDate?: string;
  checkedInAt?: string;
  createdAt?: string;
};

// ─── Payment ──────────────────────────────────────────────────────────────────

export type InitPaymentPayload = {
  email: string;
  amount: number;
  bookingId: string;
  metadata: {
    eventId: string;
    userId: string;
  };
};

export type InitPaymentResponse = {
  authorizationUrl: string;
  reference?: string;
};

// ─── Favourites ───────────────────────────────────────────────────────────────

export type FavouriteEvent = {
  id: string;
  eventId: string;
  event?: Event;
  createdAt?: string;
};

export type IsFavouritedResponse = {
  isFavorited: boolean;
};

// ─── Follow ───────────────────────────────────────────────────────────────────

export type FollowResponse = {
  id: string;
  organizerId: string;
  followerId: string;
};

export type IsFollowingResponse = {
  isFollowing: boolean;
};

// ─── Organizers ───────────────────────────────────────────────────────────────

export type Organizer = {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  tagline?: string;
  thumbnail?: string;
  banner?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
  };
  followers?: number;
  eventsCount?: number;
};

export type OrganizerStats = {
  totalEvents: number;
  upcomingEvents: number;
  totalFollowers: number;
  totalTicketsSold: number;
  totalRevenue: number;
};

export type EventSalesRecord = {
  name: string;
  sold: number;
  scanned: number;
  total: number;
};

export type EventSummary = {
  checkInRate: number;
  checkedInUsers: number;
  checkinByTicketType: {
    ticket: string;
    percentage: number;
    ticketTypeCheckinPercentage: number;
  }[];
  netSales: number;
  salesProfit: number;
  ticketDistribution: { sold: number; available: number };
  ticketsSold: number;
  totalTickets: number;
};

export type CreateOrganizerPayload = {
  userId: string;
  name: string;
  bio?: string;
  tagline?: string;
  thumbnail?: string;
  banner?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
  };
};

// ─── Users ────────────────────────────────────────────────────────────────────

export type UpdateUserPayload = {
  name: {
    firstname?: string;
    lastname?: string;
  };
  contact: {
    phone?: string;
    country?: string;
  };
  email?: string;
  // bio?: string;
  // avatar?: string;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
};

export type UnreadCountResponse = {
  count: number;
};

// ─── Account & Withdrawal ─────────────────────────────────────────────────────

export type Bank = {
  id: string;
  code: string;
  name: string;
};

export type BankAccount = {
  _id?: string;
  id?: string;
  bankCode: string;
  bankName?: string;
  accountNumber: string;
  accountHolderName: string;
};

export type ValidateBankPayload = {
  bankCode: string;
  accountNumber: string;
};

export type ValidateBankResponse = {
  accountName: string;
};

export type AddBankPayload = {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
};

export type Withdrawal = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  accountId: string;
};

/** ASSUMED — field names not confirmed against the real backend response for GET /withdrawal/summary */
export type PayoutSummary = {
  balance: number;
  canRequestWithdrawal: boolean;
  reason?: string;
};

/** ASSUMED — field names not confirmed against the real backend response for POST /withdrawal/ */
export type PayoutRequestResponse = {
  reference?: string;
  message?: string;
};

/** ASSUMED — field name not confirmed against the real backend request body for POST /withdrawal/verify */
export type VerifyPayoutPayload = {
  code: string;
};

/** ASSUMED — field names not confirmed against the real backend response for GET /withdrawal/statement */
export type StatementEntry = {
  id: string;
  type: string;
  amount: number;
  balanceAfter?: number;
  description?: string;
  createdAt: string;
};

// ─── Collaborators ────────────────────────────────────────────────────────────

export type CollaboratorStatus = "active" | "pending";

export type Collaborator = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  status: CollaboratorStatus;
  createdAt: string;
};

export type InviteCollaboratorPayload = {
  email: string;
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export type UserSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
  eventReminder: boolean;
  eventUpdateReminder: boolean;
};

// ─── Site Content ─────────────────────────────────────────────────────────────

export type SiteContent = {
  landingPage?: Record<string, unknown>;
  footerLinks?: { label: string; url: string }[];
};
