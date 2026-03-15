import { ImageSourcePropType } from "react-native";

export type EventStatus = "upcoming" | "draft" | "past";

export type ManagedEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  sold: number;
  total: number;
  image: ImageSourcePropType;
  status: EventStatus;
};

export const managedEvents: ManagedEvent[] = [
  {
    id: "upcoming-1",
    title: "Sip and paint with Wakky taisk",
    date: "Saturday , September 7th, 2023 @7:30pm GMT",
    location: "Lagos, Nigeria",
    sold: 2,
    total: 40,
    image: require("@/assets/images/event/event-1.png"),
    status: "upcoming",
  },
  {
    id: "upcoming-2",
    title: "Sip and paint with Wakky taisk",
    date: "Saturday , September 7th, 2023 @7:30pm GMT",
    location: "Lagos, Nigeria",
    sold: 2,
    total: 40,
    image: require("@/assets/images/event/event-2.jpg"),
    status: "upcoming",
  },
  {
    id: "upcoming-3",
    title: "Sip and paint with Wakky taisk",
    date: "Saturday , September 7th, 2023 @7:30pm GMT",
    location: "Lagos, Nigeria",
    sold: 2,
    total: 40,
    image: require("@/assets/images/event/event-3.jpg"),
    status: "upcoming",
  },
  {
    id: "draft-1",
    title: "Sip and paint with Wakky taisk",
    date: "Saturday , September 7th, 2023 @7:30pm GMT",
    location: "Lagos, Nigeria",
    sold: 0,
    total: 40,
    image: require("@/assets/images/event/event-2.jpg"),
    status: "draft",
  },
  {
    id: "past-1",
    title: "Sip and paint with Wakky taisk",
    date: "Saturday , September 7th, 2023 @7:30pm GMT",
    location: "Lagos, Nigeria",
    sold: 2,
    total: 40,
    image: require("@/assets/images/event/event-1.png"),
    status: "past",
  },
];
