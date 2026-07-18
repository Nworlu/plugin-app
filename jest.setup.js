import "@testing-library/jest-native/extend-expect";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

// Mock Expo constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      factories: {},
    },
  },
}));

// Mock Lucide icons (they use SVGs which can be tricky in Jest)
jest.mock("lucide-react-native", () => ({
  Wifi: "Wifi",
  WifiOff: "WifiOff",
  Calendar: "Calendar",
  User: "User",
  Home: "Home",
  Settings: "Settings",
  Bell: "Bell",
  ArrowLeft: "ArrowLeft",
}));

// Mock Reanimated
// require("react-native-reanimated/jestSetup");

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
