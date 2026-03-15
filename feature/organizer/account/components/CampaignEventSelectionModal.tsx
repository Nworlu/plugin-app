import GradientButton from "@/components/gradient-button";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Check, Square, X } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export type CampaignEventItem = {
  id: string;
  title: string;
  date: string;
  amountRange: string;
  saleProgress: number;
  image: ImageSourcePropType;
};

type CampaignEventSelectionModalProps = {
  events: CampaignEventItem[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  onClose: () => void;
  onDismiss: () => void;
  onNext: () => void;
};

const CampaignEventSelectionModal = React.forwardRef<
  BottomSheetModal,
  CampaignEventSelectionModalProps
>(
  (
    { events, selectedEventId, onSelectEvent, onClose, onDismiss, onNext },
    ref,
  ) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const canProceed = selectedEventId !== null;
    const snapPoints = useMemo(() => ["82%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#4B5563" : "#E4E7EC",
          width: 44,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <BottomSheetView
          style={{
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 20,
          }}
        >
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <ThemedText weight="700" className="text-2xl">
                Start a Campaign
              </ThemedText>
              <ThemedText
                className={`text-[15px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
              >
                What type of campaign do you want to create
              </ThemedText>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#D0D5DD",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={17} color={isDark ? "#9CA3AF" : "#344054"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="mt-2"
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {events.map((event, index) => {
              const isSelected = selectedEventId === event.id;

              return (
                <View key={event.id} className="pt-3 pb-4">
                  <View className="flex-row gap-3">
                    <Image
                      source={event.image}
                      className="w-[56px] h-[56px] rounded-md"
                      resizeMode="cover"
                    />

                    <View className="flex-1">
                      <View className="flex-row justify-between items-start gap-2">
                        <View className="flex-1">
                          <ThemedText
                            weight="700"
                            className={`text-[17px] ${isDark ? "text-[#E5E7EB]" : "text-[#344054]"}`}
                          >
                            {event.title}
                          </ThemedText>
                          <ThemedText
                            className={`text-[13px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                          >
                            {event.date}
                          </ThemedText>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => onSelectEvent(event.id)}
                          className="pt-1"
                        >
                          {isSelected ? (
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                backgroundColor: isDark ? "#E4E7EC" : "#101828",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Check
                                size={13}
                                color={isDark ? "#101828" : "#FFFFFF"}
                              />
                            </View>
                          ) : (
                            <Square
                              size={18}
                              color={isDark ? "#6B7280" : "#101828"}
                            />
                          )}
                        </TouchableOpacity>
                      </View>

                      <ThemedText
                        weight="500"
                        className={`text-[18px] mt-2 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                      >
                        {event.amountRange}
                      </ThemedText>

                      <ThemedText
                        className={`text-[14px] mt-3 ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                      >
                        Sale progress
                      </ThemedText>

                      <View className="mt-1 flex-row items-center gap-2">
                        <View
                          className={`flex-1 h-[8px] rounded-full overflow-hidden ${isDark ? "bg-[#374151]" : "bg-[#E4E7EC]"}`}
                        >
                          <View
                            className="h-full rounded-full bg-[#E2332A]"
                            style={{ width: `${event.saleProgress}%` }}
                          />
                        </View>
                        <ThemedText
                          weight="500"
                          className={`text-[15px] ${isDark ? "text-[#9CA3AF]" : "text-[#667085]"}`}
                        >
                          {event.saleProgress}%
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  {index < events.length - 1 ? (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDark ? "#374151" : "#D0D5DD",
                        marginTop: 16,
                      }}
                    />
                  ) : null}
                </View>
              );
            })}
          </ScrollView>

          <View
            style={{
              height: 1,
              backgroundColor: isDark ? "#4B2428" : "#F4B3AE",
              marginTop: 4,
            }}
          />

          <View className="pt-4 items-end">
            <GradientButton
              label="Next"
              onPress={onNext}
              disabled={!canProceed}
              height={46}
              style={{ minWidth: 96 }}
              innerStyle={{ paddingHorizontal: 32 }}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

CampaignEventSelectionModal.displayName = "CampaignEventSelectionModal";

export default CampaignEventSelectionModal;
