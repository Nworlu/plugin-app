import { queryClient } from "@/providers/QueryProvider";
import { useAuthStore } from "@/store/auth-store";
import { onSessionInvalid } from "@/utils/auth-session";
import { useEffect } from "react";
import { InteractionManager } from "react-native";

export function SessionHandler() {
  useEffect(() => {
    onSessionInvalid(() => {
      const { isAuthenticated, logout } = useAuthStore.getState();
      if (!isAuthenticated) {
        return;
      }

      InteractionManager.runAfterInteractions(() => {
        void (async () => {
          await logout();
          await queryClient.cancelQueries();
          queryClient.removeQueries();
        })();
      });
    });
  }, []);

  return null;
}
