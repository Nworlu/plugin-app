import { ThemedText } from "@/components/themed-text";
import {
  findLineEnd,
  findLineStart,
} from "@/feature/organizer/utils/text-editor";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Bold,
  Heading,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react-native";
import React, { useRef } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";

type RichTextEditorProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const RichTextEditor = ({
  value,
  onChangeText,
  placeholder = "Enter message",
}: RichTextEditorProps) => {
  const inputRef = useRef<TextInput>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    selectionRef.current = event.nativeEvent.selection;
  };

  const updateAndCursor = (
    nextValue: string,
    nextStart: number,
    nextEnd = nextStart,
  ) => {
    onChangeText(nextValue);
    selectionRef.current = { start: nextStart, end: nextEnd };
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setNativeProps({
        selection: { start: nextStart, end: nextEnd },
      });
    }, 0);
  };

  const applyWrappedText = (
    prefix: string,
    suffix: string,
    placeholder: string,
  ) => {
    const { start, end } = selectionRef.current;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);

    if (!selected) {
      const inserted = `${prefix}${placeholder}${suffix}`;
      const selStart = start + prefix.length;
      updateAndCursor(
        `${before}${inserted}${after}`,
        selStart,
        selStart + placeholder.length,
      );
      return;
    }

    const replaced = `${prefix}${selected}${suffix}`;
    updateAndCursor(
      `${before}${replaced}${after}`,
      start + prefix.length,
      end + prefix.length,
    );
  };

  const applyHeading = (marker: "## " | "### ", markerPlaceholder: string) => {
    const { start, end } = selectionRef.current;
    const hasSelection = start !== end;

    if (hasSelection) {
      const selected = value.slice(start, end);
      const transformed = selected
        .split("\n")
        .map((line) => `${marker}${line.replace(/^#{1,6}\s*/, "")}`)
        .join("\n");
      updateAndCursor(
        `${value.slice(0, start)}${transformed}${value.slice(end)}`,
        start,
        start + transformed.length,
      );
      return;
    }

    const lineStart = findLineStart(value, start);
    const lineEnd = findLineEnd(value, start);
    const line = value.slice(lineStart, lineEnd);
    const cleanLine = line.replace(/^#{1,6}\s*/, "");
    const content = cleanLine.length > 0 ? cleanLine : markerPlaceholder;
    const replacedLine = `${marker}${content}`;
    const nextValue =
      value.slice(0, lineStart) + replacedLine + value.slice(lineEnd);
    updateAndCursor(
      nextValue,
      lineStart + marker.length,
      lineStart + marker.length + content.length,
    );
  };

  const applyLinePrefix = (prefix: string) => {
    const { start, end } = selectionRef.current;
    const selected = value.slice(start, end);

    if (!selected) {
      const lineStart = findLineStart(value, start);
      const lineEnd = findLineEnd(value, start);
      const line = value.slice(lineStart, lineEnd);
      const trimmed = line.trim();
      const content = trimmed.length > 0 ? trimmed : "Item";
      const replacedLine = `${prefix}${content}`;
      const nextValue =
        value.slice(0, lineStart) + replacedLine + value.slice(lineEnd);
      updateAndCursor(
        nextValue,
        lineStart + prefix.length,
        lineStart + prefix.length + content.length,
      );
      return;
    }

    const transformed = selected
      .split("\n")
      .map((line) => `${prefix}${line}`)
      .join("\n");
    updateAndCursor(
      `${value.slice(0, start)}${transformed}${value.slice(end)}`,
      start,
      start + transformed.length,
    );
  };

  return (
    <View
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#E4E7EC",
        backgroundColor: isDark ? "#2D2D2D" : "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 48,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#374151" : "#EAECF0",
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => applyWrappedText("**", "**", "bold text")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <Bold size={18} color="#20232D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyWrappedText("_", "_", "italic text")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <Italic size={18} color="#20232D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyHeading("## ", "Heading")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <Heading size={18} color="#20232D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyHeading("### ", "Subheading")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <ThemedText weight="700" className="text-[#20232D] text-base">
            H
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyLinePrefix("> ")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <Quote size={18} color="#20232D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            applyWrappedText("[", "](https://example.com)", "link text")
          }
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <Link2 size={18} color="#20232D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyLinePrefix("- ")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <List size={18} color="#20232D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => applyLinePrefix("1. ")}
          activeOpacity={0.85}
          className="w-8 h-8 items-center justify-center"
        >
          <ListOrdered size={18} color="#20232D" />
        </TouchableOpacity>
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onSelectionChange={handleSelectionChange}
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        style={{
          minHeight: 220,
          paddingHorizontal: 20,
          paddingVertical: 20,
          color: isDark ? "#E4E7EC" : "#101928",
        }}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
};

export default RichTextEditor;
