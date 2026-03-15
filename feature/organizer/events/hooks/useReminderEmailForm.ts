import { useEffect, useRef, useState } from "react";

type ReminderSendType = "now" | "later";

const DEFAULT_DATE = new Date(2022, 7, 31, 7, 0);

export type ReminderEmailForm = ReturnType<typeof useReminderEmailForm>;

export const useReminderEmailForm = () => {
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendType, setSendType] = useState<ReminderSendType>("now");
  const [scheduleDateTime, setScheduleDateTime] = useState<Date>(DEFAULT_DATE);
  const [confirmedNotice, setConfirmedNotice] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const canSendReminder =
    senderName.trim().length > 0 &&
    emailSubject.trim().length > 0 &&
    emailMessage.trim().length > 0 &&
    confirmedNotice;

  const resetForm = () => {
    setSenderName("");
    setEmailSubject("");
    setEmailMessage("");
    setSendType("now");
    setScheduleDateTime(DEFAULT_DATE);
    setConfirmedNotice(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsCreatingReminder(false);
  };

  const handleSend = () => {
    if (!canSendReminder || isSendingReminder) return;

    setIsSendingReminder(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    toastTimerRef.current = setTimeout(() => {
      setIsSendingReminder(false);
      setShowSentToast(true);

      toastTimerRef.current = setTimeout(() => {
        setShowSentToast(false);
        resetForm();
        setIsCreatingReminder(false);
      }, 1400);
    }, 750);
  };

  return {
    isCreatingReminder,
    setIsCreatingReminder,
    senderName,
    setSenderName,
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    sendType,
    setSendType,
    scheduleDateTime,
    setScheduleDateTime,
    confirmedNotice,
    setConfirmedNotice,
    isSendingReminder,
    showSentToast,
    canSendReminder,
    handleCancel,
    handleSend,
  };
};
