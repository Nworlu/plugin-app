import CreateEventScreen from "@/feature/organizer/events/CreateEventScreen";
import { useLocalSearchParams } from "expo-router";

export default function CreateEventRoute() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  return <CreateEventScreen initialEventId={eventId} />;
}
