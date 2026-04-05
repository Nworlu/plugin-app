export type TicketType = "paid" | "free" | "donation";
export type TicketCategory = "entry" | "grouped";

export type Ticket = {
  id: string;
  ticketNumber: number;
  category: TicketCategory;
  type: TicketType;
  name: string;
  seatCategory: string;
  quantity: number;
  price: string;
  discountPct: string;
  salesStartDate: Date;
  salesStartTime: Date;
  salesEndDate: Date;
  salesEndTime: Date;
  labelGuideImage: string | null;
  labelColor: string;
  perks: string;
};
