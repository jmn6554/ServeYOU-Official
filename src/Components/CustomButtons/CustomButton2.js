import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from "react-native";

const CustomButton2 = ({ onPress, text, type }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container]}>
			<Text style={[styles.text]}>{text}</Text>
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	container: {
		width: 345,
		borderRadius: 15,
		height: 35,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
		marginTop: 5,
		marginBottom: 20,
	},

	text: {
		fontWeight: "bold",
		color: "gray",
	},
});
export default CustomButton2;
