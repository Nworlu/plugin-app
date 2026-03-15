export type SaleRecord = {
  id: string;
  ref: string;
  packageName: string;
  date: string;
  amount: string;
};

export type TicketTypeRecord = {
  id: string;
  ref: string;
  packageName: string;
  sold: string;
  price: string;
};

export type SalesTabKey = "recent" | "ticket-type";

export const SALES_ROWS: SaleRecord[] = Array.from({ length: 6 }).map(
  (_, index) => ({
    id: `sale-${index + 1}`,
    ref: "#1242801",
    packageName: "Individual package",
    date: "01/09/2022 04:00pm",
    amount: "N 3,000",
  }),
);

export const TICKET_TYPE_ROWS: TicketTypeRecord[] = Array.from({
  length: 6,
}).map((_, index) => ({
  id: `ticket-${index + 1}`,
  ref: "#1242801",
  packageName: "Individual package",
  sold: "400/500",
  price: "N 3,000",
}));

export const SALES_TABS: { key: SalesTabKey; label: string }[] = [
  { key: "recent", label: "Recent sales" },
  { key: "ticket-type", label: "Sales by ticket type" },
];
