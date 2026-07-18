import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
import { SkeletonBox, SkeletonRow } from "@/components/skeleton-box";
import { ThemedText } from "@/components/themed-text";
import {
  AddPayoutInformationModal,
  BalanceCard,
  PayoutInformationCard,
  TopUpBanner,
  TotalEarningsCard,
  WithdrawalFlowModal,
  WithdrawalHistoryCard,
  WithdrawalSummaryCard,
} from "@/feature/organizer/earnings/components";
import GlassCard from "@/feature/organizer/events/components/GlassCard";
import {
  useAddBankAccount,
  useBankDetails,
  useBanks,
  useOrganizerStats,
  useValidateBankAccount,
  useWithdrawalHistory,
  useWithdrawalSummary,
} from "@/hooks/api";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

function EarningsSkeleton({ isDark }: { isDark: boolean }) {
  const card = isDark ? "#111827" : "#FFFFFF";
  const border = isDark ? "#1F2937" : "#E4E7EC";
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <SkeletonBox width={120} height={28} borderRadius={8} />
      <SkeletonBox
        width="65%"
        height={14}
        borderRadius={5}
        style={{ marginTop: 6 }}
      />

      {/* Balance card */}
      <View
        style={{
          marginTop: 20,
          borderRadius: 24,
          backgroundColor: card,
          borderWidth: 1,
          borderColor: border,
          padding: 20,
          gap: 14,
        }}
      >
        <SkeletonBox width="40%" height={14} borderRadius={5} />
        <SkeletonBox width="55%" height={38} borderRadius={10} />
        <SkeletonRow gap={12}>
          <SkeletonBox width="45%" height={44} borderRadius={14} />
          <SkeletonBox width="45%" height={44} borderRadius={14} />
        </SkeletonRow>
      </View>

      {/* Total earnings card */}
      <View
        style={{
          marginTop: 16,
          borderRadius: 24,
          backgroundColor: card,
          borderWidth: 1,
          borderColor: border,
          padding: 20,
          gap: 10,
        }}
      >
        <SkeletonBox width="50%" height={14} borderRadius={5} />
        <SkeletonBox width="40%" height={32} borderRadius={8} />
      </View>

      {/* Stats card */}
      <View
        style={{
          marginTop: 16,
          borderRadius: 24,
          backgroundColor: card,
          borderWidth: 1,
          borderColor: border,
          padding: 20,
        }}
      >
        <SkeletonRow gap={0} style={{ justifyContent: "space-between" }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ alignItems: "center", flex: 1, gap: 6 }}>
              <SkeletonBox width={40} height={24} borderRadius={6} />
              <SkeletonBox width={55} height={12} borderRadius={4} />
            </View>
          ))}
        </SkeletonRow>
      </View>

      {/* Payout info card */}
      <View
        style={{
          marginTop: 16,
          borderRadius: 24,
          backgroundColor: card,
          borderWidth: 1,
          borderColor: border,
          padding: 20,
          gap: 12,
        }}
      >
        <SkeletonBox width="50%" height={16} borderRadius={5} />
        <SkeletonRow gap={12} style={{ alignItems: "center" }}>
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <View style={{ flex: 1, gap: 6 }}>
            <SkeletonBox width="60%" height={14} borderRadius={5} />
            <SkeletonBox width="80%" height={12} borderRadius={4} />
          </View>
        </SkeletonRow>
      </View>

      {/* Withdrawal history */}
      <View
        style={{
          marginTop: 16,
          borderRadius: 24,
          backgroundColor: card,
          borderWidth: 1,
          borderColor: border,
          padding: 20,
          gap: 14,
        }}
      >
        <SkeletonBox width="55%" height={16} borderRadius={5} />
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} gap={12} style={{ alignItems: "center" }}>
            <SkeletonBox width={36} height={36} borderRadius={18} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBox width="60%" height={13} borderRadius={4} />
              <SkeletonBox width="40%" height={11} borderRadius={4} />
            </View>
            <SkeletonBox width={55} height={13} borderRadius={4} />
          </SkeletonRow>
        ))}
      </View>
    </ScrollView>
  );
}

const EarningsScreen = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";
  // const { data: organizer } = useOrganizer(userId);
  const { data: orgStats, isLoading: isStatsLoading } = useOrganizerStats(
    userId ?? "",
  );
  const payoutSheetRef = useRef<BottomSheetModal>(null);
  const withdrawalSheetRef = useRef<BottomSheetModal>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState("");

  console.log("orgStats", orgStats);

  const {
    data: banksData,
    isLoading: isBanksLoading,
    isError: isBanksError,
  } = useBanks();
  const bankNames = banksData?.map((b) => b.name) ?? [];

  const { data: bankDetails } = useBankDetails();
  const linkedAccount = bankDetails
    ? {
        bankName: bankDetails.bankName ?? "",
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountHolderName,
      }
    : null;

  const { mutate: validateAccount, isPending: isResolvingAccount } =
    useValidateBankAccount();

  const { mutate: addBankAccountApi } = useAddBankAccount();

  const { data: withdrawalHistory, isLoading: isHistoryLoading } =
    useWithdrawalHistory();
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useWithdrawalSummary();

  const isLoading = isStatsLoading || isHistoryLoading || isSummaryLoading;

  const balance = summary?.balance ?? 0;
  const canRequestWithdrawal = summary?.canRequestWithdrawal ?? false;
  const totalEarnings = orgStats?.totalRevenue ?? 0;

  const canSubmitBankAccount =
    selectedBank.length > 0 &&
    accountNumber.length === 10 &&
    resolvedAccountName.length > 0 &&
    !isResolvingAccount;

  useEffect(() => {
    if (showPayoutModal) {
      payoutSheetRef.current?.present();
      return;
    }

    payoutSheetRef.current?.dismiss();
  }, [showPayoutModal]);

  useEffect(() => {
    if (showWithdrawalModal) {
      withdrawalSheetRef.current?.present();
      return;
    }

    withdrawalSheetRef.current?.dismiss();
  }, [showWithdrawalModal]);

  const handleAccountNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(digits);
    setResolvedAccountName("");

    if (digits.length === 10 && selectedBankCode) {
      validateAccount(
        { accountNumber: digits, bankCode: selectedBankCode },
        {
          onSuccess: (data) => {
            setResolvedAccountName(data.accountName ?? "");
          },
        },
      );
    }
  };

  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    const found = banksData?.find((b) => b.name === bank);
    setSelectedBankCode(found?.code ?? "");
    setAccountNumber("");
    setResolvedAccountName("");
  };

  const handleAddBankAccount = () => {
    if (!canSubmitBankAccount) return;

    addBankAccountApi(
      {
        bankCode: selectedBankCode,
        bankName: selectedBank,
        accountNumber,
        accountHolderName: resolvedAccountName,
      },
      {
        onSuccess: () => {
          setShowPayoutModal(false);
        },
      },
    );
  };

  const handleRemoveLinkedAccount = () => {
    setSelectedBank("");
    setSelectedBankCode("");
    setAccountNumber("");
    setResolvedAccountName("");
  };

  const handleEditLinkedAccount = () => {
    if (linkedAccount) {
      setSelectedBank(linkedAccount.bankName);
      setAccountNumber(linkedAccount.accountNumber);
      setResolvedAccountName(linkedAccount.accountName);
    }
    setShowPayoutModal(true);
  };

  return (
    <AppSafeArea className={isDark ? "bg-[#060A12]" : "bg-[#F0F4FF]"}>
      {isLoading ? (
        <EarningsSkeleton isDark={isDark} />
      ) : (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText weight="700" className="text-2xl">
            {t("earnings.title")}
          </ThemedText>
          <ThemedText
            className={`text-sm mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#2E394C]"}`}
          >
            {t("earnings.subtitle")}
          </ThemedText>

          {showBanner ? (
            <AnimatedEntry index={1}>
              <TopUpBanner
                amount="N320,000"
                onDismiss={() => setShowBanner(false)}
              />
            </AnimatedEntry>
          ) : null}

          <AnimatedEntry index={2}>
            <BalanceCard
              hideBalance={hideBalance}
              balance={balance}
              onToggleBalance={() => setHideBalance((value) => !value)}
              onWithdraw={() => setShowWithdrawalModal(true)}
            />
          </AnimatedEntry>

          <AnimatedEntry index={3}>
            <TotalEarningsCard totalEarnings={totalEarnings} />
          </AnimatedEntry>

          {orgStats ? (
            <AnimatedEntry index={4}>
              <GlassCard
                isDark={isDark}
                style={{
                  marginTop: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View className="items-center flex-1">
                  <ThemedText weight="700" className="text-xl">
                    {orgStats.totalTicketsSold}
                  </ThemedText>
                  <ThemedText
                    weight="500"
                    className={`text-xs mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#888D96]"}`}
                  >
                    {t("earnings.ticketsSold")}
                  </ThemedText>
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: isDark ? "#374151" : "#E4E7EC",
                  }}
                />
                <View className="items-center flex-1">
                  <ThemedText weight="700" className="text-xl">
                    {orgStats.totalEvents}
                  </ThemedText>
                  <ThemedText
                    weight="500"
                    className={`text-xs mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#888D96]"}`}
                  >
                    {t("earnings.totalEvents")}
                  </ThemedText>
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: isDark ? "#374151" : "#E4E7EC",
                  }}
                />
                <View className="items-center flex-1">
                  <ThemedText weight="700" className="text-xl">
                    {orgStats.totalFollowers}
                  </ThemedText>
                  <ThemedText
                    weight="500"
                    className={`text-xs mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#888D96]"}`}
                  >
                    {t("earnings.followers")}
                  </ThemedText>
                </View>
              </GlassCard>
            </AnimatedEntry>
          ) : null}

          <AnimatedEntry index={5}>
            <PayoutInformationCard
              linkedAccount={linkedAccount}
              onAddBankAccount={() => setShowPayoutModal(true)}
              onEditLinkedAccount={handleEditLinkedAccount}
              onRemoveLinkedAccount={handleRemoveLinkedAccount}
            />
          </AnimatedEntry>

          <AnimatedEntry index={6}>
            <WithdrawalSummaryCard history={withdrawalHistory ?? []} />
          </AnimatedEntry>

          <AnimatedEntry index={7}>
            <WithdrawalHistoryCard history={withdrawalHistory ?? []} />
          </AnimatedEntry>
        </ScrollView>
      )}

      <AddPayoutInformationModal
        ref={payoutSheetRef}
        selectedBank={selectedBank}
        accountNumber={accountNumber}
        resolvedAccountName={resolvedAccountName}
        isResolvingAccount={isResolvingAccount}
        banks={bankNames}
        banksLoading={isBanksLoading}
        banksError={isBanksError}
        onClose={() => {
          setShowPayoutModal(false);
          setSelectedBank("");
          setSelectedBankCode("");
          setAccountNumber("");
          setResolvedAccountName("");
        }}
        onDismiss={() => {
          setShowPayoutModal(false);
          setSelectedBank("");
          setSelectedBankCode("");
          setAccountNumber("");
          setResolvedAccountName("");
        }}
        onSelectBank={handleSelectBank}
        onChangeAccountNumber={handleAccountNumberChange}
        onSubmit={handleAddBankAccount}
        canSubmit={canSubmitBankAccount}
      />

      <WithdrawalFlowModal
        ref={withdrawalSheetRef}
        balance={balance}
        canRequestWithdrawal={canRequestWithdrawal}
        isSummaryError={isSummaryError}
        withdrawalBlockedReason={summary?.reason}
        onClose={() => setShowWithdrawalModal(false)}
      />
    </AppSafeArea>
  );
};

export default EarningsScreen;
