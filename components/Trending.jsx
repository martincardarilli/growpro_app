import { useCallback, useState } from "react";
import { FlatList, View, Text } from "react-native";

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id); // Initialize with the first post's $id

  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key); // Update active item
    }
  }, []);

  return (
    <FlatList
      data={posts} // Array of posts passed as props
      horizontal // FlatList is horizontal
      keyExtractor={(item) => item.$id} // Extract $id as the unique key
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} /> // Render TrendingItem component
      )}
      onViewableItemsChanged={viewableItemsChanged} // Callback when viewable items change
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70, // Threshold to consider an item visible
      }}
      contentOffset={{ x: 170 }} // Initial offset to scroll 170 pixels horizontally
    />
  );
};

const TrendingItem = ({ activeItem, item }) => {
  // Assuming TrendingItem is a simple component rendering post data
  return (
    <View>
      {/* Render different styles or content based on whether this item is active */}
      <Text>{activeItem === item.$id ? "Active" : "Inactive"}</Text>
      {/* Display thumbnail or other details */}
    </View>
  );
};

export default Trending;
