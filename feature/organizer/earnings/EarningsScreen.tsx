import { AnimatedEntry } from "@/components/animated-list-item";
import AppSafeArea from "@/components/app-safe-area";
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
import {
  useAddBankAccount,
  useBankDetails,
  useBanks,
  useOrganizer,
  useOrganizerStats,
  useValidateBankAccount,
  useWithdrawalHistory,
  useWithdrawalStats,
} from "@/hooks/api";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/auth-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

const EarningsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? "";
  // const { data: organizer } = useOrganizer(userId);
  const { data: orgStats } = useOrganizerStats(userId ?? "");
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

  const { data: withdrawalHistory } = useWithdrawalHistory();
  const { data: withdrawalStats } = useWithdrawalStats();

  const balance = user?.wallet ?? 0;
  const totalEarnings =
    withdrawalStats?.totalWithdrawn ?? orgStats?.totalRevenue ?? 0;

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
    <AppSafeArea>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText weight="700" className="text-2xl">
          Earnings
        </ThemedText>
        <ThemedText
          className={`text-sm mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#2E394C]"}`}
        >
          View and manage all your earnings and payouts here.
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
            <View
              className="mt-5 rounded-3xl px-4 py-4 flex-row justify-between"
              style={{
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#E4E7EC",
                backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
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
                  Tickets Sold
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
                  Total Events
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
                  Followers
                </ThemedText>
              </View>
            </View>
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
          <WithdrawalSummaryCard
            stats={withdrawalStats}
            history={withdrawalHistory ?? []}
          />
        </AnimatedEntry>

        <AnimatedEntry index={7}>
          <WithdrawalHistoryCard history={withdrawalHistory ?? []} />
        </AnimatedEntry>
      </ScrollView>

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
        onClose={() => setShowWithdrawalModal(false)}
      />
    </AppSafeArea>
  );
};

export default EarningsScreen;
