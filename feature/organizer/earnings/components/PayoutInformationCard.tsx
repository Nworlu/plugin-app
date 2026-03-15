import { ThemedText } from "@/components/themed-text";
import { LinkedBankAccount } from "@/feature/organizer/earnings/constants/earnings";
import { useTheme } from "@/providers/ThemeProvider";
import { Building2, Pencil, Plus, X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type PayoutInformationCardProps = {
  linkedAccount: LinkedBankAccount | null;
  onAddBankAccount: () => void;
  onEditLinkedAccount: () => void;
  onRemoveLinkedAccount: () => void;
};

const PayoutInformationCard = ({
  linkedAccount,
  onAddBankAccount,
  onEditLinkedAccount,
  onRemoveLinkedAccount,
}: PayoutInformationCardProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className="mt-5 rounded-3xl px-4 py-5"
      style={{
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#E4E7EC",
        backgroundColor: isDark ? "#1C1C1E" : "#FBFCFD",
      }}
    >
      {linkedAccount ? (
        <>
          <ThemedText weight="700" className="text-[18px]">
            Linked Payout Information
          </ThemedText>
          <ThemedText
            className={`text-[14px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            Withdrawals from your wallet will be paid to this account.
          </ThemedText>

          <View
            className="mt-5 rounded-2xl px-5 py-5"
            style={{ backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF" }}
          >
            <ThemedText weight="700" className="text-[22px]">
              {linkedAccount.accountNumber}
            </ThemedText>
            <ThemedText weight="700" className="text-[16px] mt-3">
              {linkedAccount.accountName}
            </ThemedText>
            <ThemedText
              className={`text-[14px] mt-2 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              {linkedAccount.bankName}
            </ThemedText>
          </View>

          <View
            className="mt-3 rounded-2xl px-4 py-4 flex-row items-center gap-5"
            style={{ backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF" }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onEditLinkedAccount}
              className="flex-row items-center gap-2"
            >
              <Pencil size={16} color="#F04438" />
              <ThemedText weight="500" className="text-[#F04438] text-[14px]">
                Edit
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onRemoveLinkedAccount}
              className="flex-row items-center gap-2"
            >
              <X size={15} color="#667085" />
              <ThemedText
                weight="500"
                className={`text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                Remove
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <ThemedText weight="500" className="text-xl">
            Add Payout Information
          </ThemedText>
          <ThemedText
            className={`text-sm mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
          >
            Add a bank account to receive payouts
          </ThemedText>

          <View className="mt-8 items-center justify-center">
            <View className="w-[180px] h-[120px] items-center justify-center">
              <Building2
                size={68}
                color={isDark ? "#9CA3AF" : "#2B2B2B"}
                strokeWidth={1.7}
              />
            </View>

            <ThemedText
              weight="500"
              className={`text-lg mt-2 text-center ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
            >
              No bank account Found
            </ThemedText>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onAddBankAccount}
              style={{
                marginTop: 24,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isDark ? "#4B5563" : "#141414",
                paddingHorizontal: 20,
                height: 52,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Plus size={18} color={isDark ? "#E4E7EC" : "#141414"} />
              <ThemedText weight="500" className="text-base">
                Add Bank Account
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default PayoutInformationCard;
