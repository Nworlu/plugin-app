import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type BookedVenue = {
  id: string;
  venueId: string;
  venueName: string;
  venueCity: string;
  eventType: string;
  eventDate: string;
  numberOfDays: number;
  expectedGuests: string;
  totalCost: number;
  bookedAt: string; // ISO date string
};

type BookingsContextType = {
  bookings: BookedVenue[];
  hasBookings: boolean;
  addBooking: (booking: Omit<BookedVenue, "id" | "bookedAt">) => void;
};

const BookingsContext = createContext<BookingsContextType | undefined>(
  undefined,
);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookedVenue[]>([]);

  const addBooking = useCallback(
    (booking: Omit<BookedVenue, "id" | "bookedAt">) => {
      const newBooking: BookedVenue = {
        ...booking,
        id: `booking-${Date.now()}`,
        bookedAt: new Date().toISOString(),
      };
      setBookings((prev) => [newBooking, ...prev]);
    },
    [],
  );

  const value = useMemo(
    () => ({ bookings, hasBookings: bookings.length > 0, addBooking }),
    [bookings, addBooking],
  );

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}
