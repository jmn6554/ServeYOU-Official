import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Touchable,
} from "react-native";

const CustomButton6 = ({ onPress, text, type }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
      <Text style={[styles.text]}>{text}</Text>
    </TouchableOpacity>

  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 15,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 0,
    marginTop: 0,
  },

  text: {
    fontWeight: "bold",
    color: "gray",
  },
});
export default CustomButton6;
