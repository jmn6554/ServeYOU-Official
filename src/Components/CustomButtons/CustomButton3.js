import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
	Dimensions
} from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CustomButton3 = ({ onPress, text, type }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container]}>
			<View style={{ alignContent: "center", marginRight: Dimensions.get("screen").width * 0.45 }}>
				<Ionicons
					name="logo-facebook"
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
		width: "75%",
		borderRadius: 15,
		height: Dimensions.get("screen").height * 0.06,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
		marginTop: Dimensions.get("screen").height * 0.03,
		backgroundColor: "#4267B2",
		flexDirection: "row"
	},

	text: {
		fontWeight: "bold",
		color: "white",
		position: "absolute",
		left: Dimensions.get("screen").width * 0.22
	},
});
export default CustomButton3;
