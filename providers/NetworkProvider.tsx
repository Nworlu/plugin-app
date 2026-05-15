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

  // Track whether we've received the first real reading so we don't flash
  // the offline screen on startup before NetInfo resolves.
  const ready = useRef(false);

  useEffect(() => {
    const unsub: NetInfoSubscription = NetInfo.addEventListener(
      (info: NetInfoState) => {
        const connected = info.isConnected ?? true;
        const reachable = info.isInternetReachable ?? null;

        // On first event we always trust the result
        if (!ready.current) {
          ready.current = true;
          setState({ isConnected: connected, isInternetReachable: reachable });
          return;
        }

        setState({ isConnected: connected, isInternetReachable: reachable });
      },
    );

    return () => unsub();
  }, []);

  return (
    <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}

/** Returns true when the device has no active internet connection */
export function useIsOffline() {
  const { isConnected, isInternetReachable } = useNetwork();
  // isInternetReachable can be null while still determining — treat null as online
  return isConnected === false || isInternetReachable === false;
}
