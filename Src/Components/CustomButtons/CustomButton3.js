import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CustomButton3 = ({ onPress, text, type }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container]}>
			<View style={{ position: "absolute", left: 50 }}>
				<Ionicons
					name="logo-facebook"
					type="ionicon"
					color="white"
					size="25"
				/>
			</View>
			<Text style={[styles.text]}>    {text}</Text>
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
		marginTop: 50,
		backgroundColor: "#4267B2",
		flexDirection: "row"
	},

	text: {
		fontWeight: "bold",
		color: "white",
		position: "absolute",
		left: 75
	},
});
export default CustomButton3;
