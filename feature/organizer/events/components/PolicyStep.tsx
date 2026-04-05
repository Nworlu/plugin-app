import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/providers/ThemeProvider";
import { CheckCircle2, ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const OptionalBadge = ({ isDark }: { isDark: boolean }) => (
  <View
    style={{
      backgroundColor: isDark ? "#2D1F00" : "#FEF3C7",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    }}
  >
    <ThemedText style={{ fontSize: 11, color: "#92400E", fontWeight: "700" }}>
      OPTIONAL
    </ThemedText>
  </View>
);

const POLICY_SECTIONS = [
  {
    title: "1. Attendee Refund Obligations:",
    body: "Organizers are required to honor refund requests submitted by attendees through our platform within the designated refund request window, typically up to 14 days before the event date.",
  },
  {
    title: "2. Event Cancellation or Rescheduling:",
    body: "If an organizer cancels or reschedules an event, they are required to process full refunds to all attendees within 7 business days. Organizers must notify attendees as soon as possible through the platform.",
  },
  {
    title: "3. Partial Refunds:",
    body: "In cases where partial refunds are warranted, organizers must clearly communicate the refund amount and rationale to affected attendees. All partial refund decisions are subject to platform review.",
  },
  {
    title: "4. Non-Refundable Fees:",
    body: "Certain service fees charged by the platform are non-refundable. Organizers must clearly disclose any non-refundable components at the time of ticket purchase.",
  },
  {
    title: "5. Refund Review Process:",
    body: "Our platform reserves the right to review and approve refund requests based on the specific circumstances of each case. This includes ensuring that all refund requests align with the platform's terms and conditions.",
  },
  {
    title: "6. Special Circumstances and Exceptions:",
    body: "In extraordinary situations, such as natural disasters or public health emergencies, our platform may issue guidelines for handling refunds. Organizers are expected to comply with these directives to ensure fair treatment of attendees.",
  },
  {
    title: "7. Communication with Attendees:",
    body: "Organizers are encouraged to maintain clear and timely communication with attendees regarding any changes to the event. This includes informing them of any cancellations, rescheduling, or special refund policies in place.",
  },
];

export default function PolicyStep() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const borderColor = isDark ? "#2C2C2E" : "#E4E7EC";
  const mutedText = isDark ? "#98A2B3" : "#667085";
  const titleColor = isDark ? "#F2F4F7" : "#101828";
  const bodyColor = isDark ? "#D0D5DD" : "#344054";

  const [refundExpanded, setRefundExpanded] = useState(true);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [featuredExpanded, setFeaturedExpanded] = useState(false);
  const [vendorsExpanded, setVendorsExpanded] = useState(false);

  return (
    <View>
      {/* Title */}
      <ThemedText
        weight="700"
        style={{ fontSize: 22, marginBottom: 4, color: titleColor }}
      >
        Tick to confirm you have read and{"\n"}accepted Plugin&apos;s refund
        policy.
      </ThemedText>
      <ThemedText
        weight="700"
        style={{
          fontSize: 15,
          marginTop: 16,
          marginBottom: 16,
          color: titleColor,
        }}
      >
        Event Details
      </ThemedText>

      {/* ADD AGENDA — completed */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
        >
          <CheckCircle2 size={20} color="#12B76A" fill="#12B76A" />
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            ADD AGENDA
          </ThemedText>
          <OptionalBadge isDark={isDark} />
          <ChevronDown size={16} color={mutedText} />
        </View>
      </View>

      {/* ADD PHOTO/VIDEOS — completed */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
        >
          <CheckCircle2 size={20} color="#12B76A" fill="#12B76A" />
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            ADD PHOTO/VIDEOS
          </ThemedText>
          <OptionalBadge isDark={isDark} />
          <ChevronDown size={16} color={mutedText} />
        </View>
      </View>

      {/* REFUND POLICY — expandable */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => setRefundExpanded((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: refundExpanded ? "#F04438" : borderColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {refundExpanded && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#F04438",
                }}
              />
            )}
          </View>
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            REFUND POLICY
          </ThemedText>
          <ChevronDown
            size={16}
            color={mutedText}
            style={{
              transform: [{ rotate: refundExpanded ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>

        {refundExpanded && (
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <ThemedText
              style={{
                fontSize: 12,
                color: mutedText,
                marginBottom: 14,
                lineHeight: 18,
              }}
            >
              Add photos to show what your event will be about.{"\n"}You can
              upload up to 6 images.
            </ThemedText>

            {/* Policy header */}
            <ThemedText
              weight="700"
              style={{ fontSize: 16, color: titleColor, marginBottom: 10 }}
            >
              Refund Policy for Organizers
            </ThemedText>

            {/* Intro */}
            <ThemedText
              style={{
                fontSize: 13,
                color: bodyColor,
                lineHeight: 20,
                marginBottom: 14,
              }}
            >
              Our platform has a comprehensive refund policy designed to protect
              attendees and maintain event integrity. Organizers must adhere to
              the following guidelines:
            </ThemedText>

            {/* Policy sections */}
            {POLICY_SECTIONS.map((section) => (
              <View key={section.title} style={{ marginBottom: 12 }}>
                <ThemedText
                  weight="700"
                  style={{
                    fontSize: 13,
                    color: bodyColor,
                    lineHeight: 20,
                    marginBottom: 4,
                  }}
                >
                  {section.title}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 13, color: bodyColor, lineHeight: 20 }}
                >
                  {"- "}
                  {section.body}
                </ThemedText>
              </View>
            ))}

            {/* Checkbox */}
            <TouchableOpacity
              onPress={() => setPolicyAgreed((v) => !v)}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
                marginTop: 8,
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: policyAgreed ? "#F04438" : borderColor,
                  backgroundColor: policyAgreed
                    ? isDark
                      ? "#3B1A1A"
                      : "#FEF0EF"
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {policyAgreed && (
                  <View
                    style={{
                      width: 9,
                      height: 5,
                      borderLeftWidth: 2,
                      borderBottomWidth: 2,
                      borderColor: "#F04438",
                      transform: [{ rotate: "-45deg" }, { translateY: -1 }],
                    }}
                  />
                )}
              </View>
              <ThemedText
                style={{
                  fontSize: 13,
                  color: bodyColor,
                  lineHeight: 20,
                  flex: 1,
                }}
              >
                I have read and agree to the refund policies and guidelines
                outlined above. By checking this box, I acknowledge and accept
                responsibility for adhering to these terms as an event
                organizer.
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* FEATURED GUEST — optional */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => setFeaturedExpanded((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: featuredExpanded ? "#F04438" : borderColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {featuredExpanded && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#F04438",
                }}
              />
            )}
          </View>
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            FEATURED GUEST
          </ThemedText>
          <OptionalBadge isDark={isDark} />
          <ChevronDown
            size={16}
            color={mutedText}
            style={{
              transform: [{ rotate: featuredExpanded ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>

        {featuredExpanded && (
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <ThemedText
              style={{ fontSize: 12, color: mutedText, lineHeight: 18 }}
            >
              Add featured guests or speakers to highlight on your event page.
            </ThemedText>
          </View>
        )}
      </View>

      {/* ADD VENDORS — optional */}
      <View
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <TouchableOpacity
          onPress={() => setVendorsExpanded((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 14,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: vendorsExpanded ? "#F04438" : borderColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {vendorsExpanded && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#F04438",
                }}
              />
            )}
          </View>
          <ThemedText
            weight="700"
            style={{ fontSize: 13, color: titleColor, flex: 1 }}
          >
            ADD VENDORS
          </ThemedText>
          <OptionalBadge isDark={isDark} />
          <ChevronDown
            size={16}
            color={mutedText}
            style={{
              transform: [{ rotate: vendorsExpanded ? "180deg" : "0deg" }],
            }}
          />
        </TouchableOpacity>

        {vendorsExpanded && (
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <ThemedText
              style={{ fontSize: 12, color: mutedText, lineHeight: 18 }}
            >
              Add vendors or sponsors participating in your event.
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
