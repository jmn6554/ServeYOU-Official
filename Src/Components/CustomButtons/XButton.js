import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


const CustomButton = ({ onPress, text, type }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container]}>
			<Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>Done</Text>
			{/* <Ionicons
                name="close-outline"
                type="ionicon"
                color="black"
                size="38"
            /> */}
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	container: {
		width: 50,
		height: 40,
		borderRadius: 100,
		backgroundColor: "transparent",
		position: "absolute",
		top: "0.1%",
		right: "5%"

	},

	text: {
		fontWeight: "bold",
		color: "white",
	},
});
export default CustomButton;
