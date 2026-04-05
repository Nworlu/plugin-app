import { useRef, useState } from "react";
import { ViewToken } from "react-native";

/**
 * Tracks which FlatList items have entered the viewport.
 * Each item is only marked visible once (animation fires once, never resets).
 *
 * Usage:
 *   const { visibleIds, onViewableItemsChanged, viewabilityConfig } = useViewableList();
 *   <FlatList
 *     onViewableItemsChanged={onViewableItemsChanged}
 *     viewabilityConfig={viewabilityConfig}
 *     renderItem={({ item }) => (
 *       <AnimatedListItem isVisible={visibleIds.has(item.id)}>
 *         <YourCard item={item} />
 *       </AnimatedListItem>
 *     )}
 *   />
 */
export function useViewableList() {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const seenIds = useRef(new Set<string>());

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 15 });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const newIds: string[] = [];
      viewableItems.forEach(({ item }) => {
        const id = item?.id ?? String(item);
        if (!seenIds.current.has(id)) {
          seenIds.current.add(id);
          newIds.push(id);
        }
      });
      if (newIds.length > 0) {
        setVisibleIds((prev) => {
          const next = new Set(prev);
          newIds.forEach((id) => next.add(id));
          return next;
        });
      }
    },
  );

  return {
    visibleIds,
    onViewableItemsChanged: onViewableItemsChanged.current,
    viewabilityConfig: viewabilityConfig.current,
  };
}
