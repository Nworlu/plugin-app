import BankIcon from "@/assets/svgs/bank-icon.svg";
import CalendarIcon from "@/assets/svgs/calendar-icon.svg";
import UsersIcon from "@/assets/svgs/users-icon.svg";

export const homeTabsList: TabListType[] = [
  {
    title: "Upcoming Events",
    tag: "upcoming",
    hasNumber: false,
  },
  {
    title: "Currently Happening",
    tag: "currently",
    hasNumber: true,
    count: 2,
  },
] as const;

export const upcomingEvents: OrganizerEvent[] = [
  {
    id: "event-1",
    title: "Sip n Paint with Wakkytails",
    date: "April 1st, 2023",
    time: "7:00 am",
    location: "Silverbird cinemas gallery, Uduodoma Avenue.",
    ticketsSold: 2,
    ticketsTotal: 40,
    image: require("@/assets/images/event/event-1.png"),
    isFavorite: false,
  },
  {
    id: "event-2",
    title: "Designer's Connect",
    date: "April 1st, 2023",
    time: "7:00 am",
    location: "Silverbird cinemas gallery, Uduodoma Avenue.",
    ticketsSold: 2,
    ticketsTotal: 40,
    image: require("@/assets/images/event/event-2.jpg"),
    isFavorite: true,
  },
  {
    id: "event-3",
    title: "Dev festival uYO",
    date: "April 1st, 2023",
    time: "7:00 am",
    location: "Silverbird cinemas gallery, Uduodoma Avenue.",
    ticketsSold: 2,
    ticketsTotal: 40,
    image: require("@/assets/images/event/event-3.jpg"),
    isFavorite: true,
  },
];

export const currentlyHappeningEvents: OrganizerEvent[] = [
  {
    id: "live-1",
    title: "Sip n Paint with Wakkytails",
    date: "",
    time: "",
    location: "Silverbird cinemas gallery, Uduodoma Avenue.",
    ticketsSold: 22,
    ticketsTotal: 40,
    image: require("@/assets/images/event/event-3.jpg"),
    isFavorite: false,
  },
  {
    id: "live-2",
    title: "Designer's Connect",
    date: "",
    time: "",
    location: "Silverbird cinemas gallery, Uduodoma Avenue.",
    ticketsSold: 2,
    ticketsTotal: 40,
    image: require("@/assets/images/home/publish-2.png"),
    isFavorite: true,
  },
];

export const completeSetuplList = [
  {
    title: "Create and Publish an event",
    content: "Create and publish events for attendees all around the world",
    Icon: CalendarIcon,
  },
  {
    title: "Set-up Organizer Profile",
    content: "Highlight your brand by your name, image and bio",
    Icon: UsersIcon,
  },
  {
    title: "Add pay-out account",
    content:
      "Add an account where we can send all your funds to when you make a withdrawal",
    Icon: BankIcon,
  },
];

export const resourcesList = [
  {
    title: "Creating Tickets",
    content:
      "This guide will show you how to create and edit ticket types for your event",
    image: require("@/assets/images/home/tips-1.png"),
  },
  {
    title: "Scanning and Check In",
    content:
      "This course guides you how to use the Plugin scanner to scan tickets and check-in attendees for your event.",
    image: require("@/assets/images/home/tips-2.png"),
  },
  {
    title: "Getting Paid via Plugin",
    content:
      "This guide will walk you through how to add a payout method to your event if you're selling tickets using Plugin's Payment Processing.",
    image: require("@/assets/images/home/tips-3.png"),
  },
];

export type TabListType = {
  title: string;
  tag: HomeTabTag;
  hasNumber: boolean;
  count?: number;
};

export type HomeTabTag = "upcoming" | "currently";

export type OrganizerEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  ticketsSold: number;
  ticketsTotal: number;
  image: any;
  isFavorite?: boolean;
};

export type Venue = {
  id: string;
  name: string;
  location: string;
  city: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  image: any;
};

export const venuesList: Venue[] = [
  {
    id: "venue-1",
    name: "The Grand Ballroom",
    location: "Plot 12, Wuse Zone 4",
    city: "Abuja",
    capacity: 500,
    pricePerDay: 250000,
    rating: 4.8,
    reviewCount: 64,
    description:
      "A stunning ballroom with state-of-the-art AV equipment, built-in stage, and elegant chandeliers. Perfect for large conferences, gala dinners, and corporate events.",
    amenities: ["Stage", "AV Equipment", "Wi-Fi", "Parking", "Catering", "AC"],
    image: require("@/assets/images/event/event-1.png"),
  },
  {
    id: "venue-2",
    name: "Creatives Hub",
    location: "14B Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    capacity: 120,
    pricePerDay: 80000,
    rating: 4.5,
    reviewCount: 38,
    description:
      "A modern co-working and events space designed for workshops, product launches, art exhibitions, and networking events. Vibrant atmosphere with flexible layouts.",
    amenities: ["Wi-Fi", "Projector", "Lounge", "Kitchenette", "Whiteboards"],
    image: require("@/assets/images/event/event-2.jpg"),
  },
  {
    id: "venue-3",
    name: "Outdoor Arena Uyo",
    location: "Aka Road, Off stadium",
    city: "Uyo",
    capacity: 2000,
    pricePerDay: 400000,
    rating: 4.6,
    reviewCount: 52,
    description:
      "A spacious open-air arena ideal for concerts, festivals, outdoor markets, and large community events. Covered stage, flood lights, and generator backup included.",
    amenities: ["Stage", "Flood Lights", "Generator", "Security", "Parking"],
    image: require("@/assets/images/event/event-3.jpg"),
  },
  {
    id: "venue-4",
    name: "Summit Conference Centre",
    location: "22 Adeola Odeku Street, VI",
    city: "Lagos",
    capacity: 200,
    pricePerDay: 150000,
    rating: 4.7,
    reviewCount: 29,
    description:
      "A professional conference centre with breakout rooms, high-speed internet, and premium catering options. Ideal for summits, training sessions, and AGMs.",
    amenities: ["Breakout Rooms", "Wi-Fi", "Catering", "AC", "AV Equipment"],
    image: require("@/assets/images/home/publish-1.png"),
  },
];
