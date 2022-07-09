import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import { View, Text, StyleSheet } from "react-native";

const [search, setSearch] = useState("");

const updateSearch = (search) => {
  {
    setSearch(search);
  }
  const SearchBar = () => {
    return (
      <View style={styles.view}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          value={search}
        />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    height: 50,
    width: 50,
  },
});

export default SearchBar;
