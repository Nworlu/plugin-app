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
  },
] as const;

export const completeSetuplList = [
  {
    title: "Create and Publish an event",
    content: "Create and publish events for attendees all around the world",
  },
  {
    title: "Set-up Organizer Profile",
    content: "Highlight your brand by your name, image and bio",
  },
  {
    title: "Add pay-out account",
    content:
      "Add an account where we can send all your funds to when you make a withdrawal",
  },
];

export const resourcesList = [
  {
    title: "Creating Tickets",
    content:
      "This guide will show you how to create and edit ticket types for your event",
  },
  {
    title: "Scanning and Check In",
    content:
      "This course guides you how to use the Plugin scanner to scan tickets and check-in attendees for your event.",
  },
  {
    title: "Getting Paid via Plugin",
    content:
      "This guide will walk you through how to add a payout method to your event if you're selling tickets using Plugin's Payment Processing.",
  },
];

export type TabListType = {
  title: string;
  tag: string;
  hasNumber: boolean;
};
