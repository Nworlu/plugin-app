export type LinkedBankAccount = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export type WithdrawalRecord = {
  id: string;
  reference: string;
  amount: string;
  date: string;
  status: "Pending" | "Completed";
};

export const BANKS = ["FCMB", "Zenith Bank", "Access Bank", "GTBank"];

export const WITHDRAWAL_HISTORY: WithdrawalRecord[] = [
  {
    id: "wd-1",
    reference: "TRX890123456",
    amount: "N1,089,649.04",
    date: "01/09/2022 04:00pm",
    status: "Pending",
  },
  {
    id: "wd-2",
    reference: "TRX890123456",
    amount: "N1,089,649.04",
    date: "01/09/2022 04:00pm",
    status: "Completed",
  },
  {
    id: "wd-3",
    reference: "TRX890123456",
    amount: "N1,089,649.04",
    date: "01/09/2022 04:00pm",
    status: "Completed",
  },
  {
    id: "wd-4",
    reference: "TRX890123456",
    amount: "N1,089,649.04",
    date: "01/09/2022 04:00pm",
    status: "Completed",
  },
];
