import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from "@react-native-community/netinfo";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

type NetworkContextValue = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
};

const NetworkContext = createContext<NetworkContextValue>({
  isConnected: true,
  isInternetReachable: true,
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NetworkContextValue>({
    isConnected: true,
    isInternetReachable: true,
  });

  const [debouncedOffline, setDebouncedOffline] = useState(false);

  // Track whether we've received the first real reading so we don't flash
  // the offline screen on startup before NetInfo resolves.
  const ready = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub: NetInfoSubscription = NetInfo.addEventListener(
      (info: NetInfoState) => {
        const connected = info.isConnected ?? true;
        const reachable = info.isInternetReachable ?? null;
        const isCurrentlyOffline = connected === false || reachable === false;

        // On first event we always trust the result
        if (!ready.current) {
          ready.current = true;
          setState({ isConnected: connected, isInternetReachable: reachable });
          setDebouncedOffline(isCurrentlyOffline);
          return;
        }

        setState({ isConnected: connected, isInternetReachable: reachable });

        // Debounce the offline state to prevent flickering during app switching
        // or brief network handovers.
        if (isCurrentlyOffline) {
          if (!debounceTimer.current) {
            debounceTimer.current = setTimeout(() => {
              setDebouncedOffline(true);
            }, 1500); // 1.5s delay before showing offline screen
          }
        } else {
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
          }
          setDebouncedOffline(false);
        }
      },
    );

    // Also handle AppState changes to refresh network status when coming back to foreground
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          NetInfo.refresh();
        }
      },
    );

    return () => {
      unsub();
      appStateListener.remove();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <NetworkContext.Provider value={state}>
      {/* We pass a modified value or use a internal hook for the overlay */}
      <InternalNetworkContext.Provider value={{ ...state, isOffline: debouncedOffline }}>
        {children}
      </InternalNetworkContext.Provider>
    </NetworkContext.Provider>
  );
}

const InternalNetworkContext = createContext<NetworkContextValue & { isOffline: boolean }>({
  isConnected: true,
  isInternetReachable: true,
  isOffline: false,
});

export function useNetwork() {
  return useContext(NetworkContext);
}

/** Returns true when the device has no active internet connection (debounced) */
export function useIsOffline() {
  return useContext(InternalNetworkContext).isOffline;
}
