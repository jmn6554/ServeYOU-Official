import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
	Touchable,
} from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CustomButton5 = ({ onPress, text, type }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container]}>
			<View style={{ position: "absolute", left: 50, top: 5 }}>
				<Ionicons
					name="logo-apple"
					type="ionicon"
					color="white"
					size="25"
				/>
			</View>
			<Text style={[styles.text]}>{text}</Text>
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	container: {
		width: "80%",
		borderRadius: 15,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
		marginTop: 5,
		backgroundColor: "#000000",
		flexDirection: "row"
	},

	text: {
		fontWeight: "bold",
		color: "white",
		position: "absolute",
		left: 90
	},
});
export default CustomButton5;
