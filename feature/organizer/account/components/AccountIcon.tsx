import type { AccountIconName } from "@/feature/organizer/account/constants/account";
import {
  Bell,
  CircleHelp,
  File,
  FileLock2,
  Languages,
  List,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  SunMoon,
  User,
  Users,
  Wallet,
} from "lucide-react-native";
import React from "react";

type AccountIconProps = {
  name: AccountIconName;
  size?: number;
  color?: string;
};

const AccountIcon = ({
  name,
  size = 18,
  color = "#141414",
}: AccountIconProps) => {
  switch (name) {
    case "list":
      return <List size={size} color={color} />;
    case "sparkles":
      return <Sparkles size={size} color={color} />;
    case "wallet":
      return <Wallet size={size} color={color} />;
    case "user":
      return <User size={size} color={color} />;
    case "settings":
      return <Settings size={size} color={color} />;
    case "users":
      return <Users size={size} color={color} />;
    case "bell":
      return <Bell size={size} color={color} />;
    case "shield":
      return <Shield size={size} color={color} />;
    case "shield-check":
      return <ShieldCheck size={size} color={color} />;
    case "languages":
      return <Languages size={size} color={color} />;
    case "circle-help":
      return <CircleHelp size={size} color={color} />;
    case "send":
      return <Send size={size} color={color} />;
    case "file":
      return <File size={size} color={color} />;
    case "file-lock":
      return <FileLock2 size={size} color={color} />;
    case "sun-moon":
      return <SunMoon size={size} color={color} />;
    default:
      return <List size={size} color={color} />;
  }
};

export default AccountIcon;
