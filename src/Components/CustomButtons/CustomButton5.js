import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
	Touchable,
	Dimensions
} from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CustomButton5 = ({ onPress, text, type }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.container]}>
			<View style={{ alignContent: "center", marginRight: Dimensions.get("screen").width * 0.45 }}>
				<Ionicons
					name="logo-apple"
					type="ionicon"
					color="white"
					size="25"
				/>
			</View>
			<Text style={[styles.text]}>{text}</Text>
		</TouchableOpacity >
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
		marginTop: Dimensions.get("screen").height * 0.002,
		backgroundColor: "#000000",
		flexDirection: "row"
	},

	text: {
		fontWeight: "bold",
		color: "white",
		position: "absolute",
		left: Dimensions.get("screen").width * 0.22
	},
});
export default CustomButton5;
