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
import { LinkedBankAccount } from "@/feature/organizer/earnings/constants/earnings";
import { useTheme } from "@/providers/ThemeProvider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";

const EarningsScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const payoutSheetRef = useRef<BottomSheetModal>(null);
  const withdrawalSheetRef = useRef<BottomSheetModal>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);
  const [resolvedAccountName, setResolvedAccountName] = useState("");
  const [linkedAccount, setLinkedAccount] = useState<LinkedBankAccount | null>(
    null,
  );

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

    if (digits.length === 10 && selectedBank) {
      setIsResolvingAccount(true);
      setTimeout(() => {
        setResolvedAccountName("OLIVIA MAGARET");
        setIsResolvingAccount(false);
      }, 900);
      return;
    }

    setIsResolvingAccount(false);
  };

  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    setShowBankPicker(false);
    setResolvedAccountName("");

    if (accountNumber.length === 10) {
      setIsResolvingAccount(true);
      setTimeout(() => {
        setResolvedAccountName("OLIVIA MAGARET");
        setIsResolvingAccount(false);
      }, 900);
    }
  };

  const handleAddBankAccount = () => {
    if (!canSubmitBankAccount) return;

    setLinkedAccount({
      bankName: selectedBank,
      accountNumber,
      accountName: resolvedAccountName,
    });
    setShowPayoutModal(false);
    setShowBankPicker(false);
  };

  const handleRemoveLinkedAccount = () => {
    setLinkedAccount(null);
    setSelectedBank("");
    setAccountNumber("");
    setResolvedAccountName("");
    setIsResolvingAccount(false);
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
            onToggleBalance={() => setHideBalance((value) => !value)}
            onWithdraw={() => setShowWithdrawalModal(true)}
          />
        </AnimatedEntry>

        <AnimatedEntry index={3}>
          <TotalEarningsCard />
        </AnimatedEntry>

        <AnimatedEntry index={4}>
          <PayoutInformationCard
            linkedAccount={linkedAccount}
            onAddBankAccount={() => setShowPayoutModal(true)}
            onEditLinkedAccount={handleEditLinkedAccount}
            onRemoveLinkedAccount={handleRemoveLinkedAccount}
          />
        </AnimatedEntry>

        <AnimatedEntry index={5}>
          <WithdrawalSummaryCard />
        </AnimatedEntry>

        <AnimatedEntry index={6}>
          <WithdrawalHistoryCard />
        </AnimatedEntry>
      </ScrollView>

      <AddPayoutInformationModal
        ref={payoutSheetRef}
        selectedBank={selectedBank}
        accountNumber={accountNumber}
        resolvedAccountName={resolvedAccountName}
        isResolvingAccount={isResolvingAccount}
        showBankPicker={showBankPicker}
        onClose={() => {
          setShowPayoutModal(false);
          setShowBankPicker(false);
        }}
        onDismiss={() => {
          setShowPayoutModal(false);
          setShowBankPicker(false);
        }}
        onOpenBankPicker={() => setShowBankPicker((value) => !value)}
        onSelectBank={handleSelectBank}
        onChangeAccountNumber={handleAccountNumberChange}
        onSubmit={handleAddBankAccount}
        canSubmit={canSubmitBankAccount}
      />

      <WithdrawalFlowModal
        ref={withdrawalSheetRef}
        onClose={() => setShowWithdrawalModal(false)}
      />
    </AppSafeArea>
  );
};

export default EarningsScreen;
