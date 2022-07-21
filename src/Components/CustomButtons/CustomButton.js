import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
	Dimensions
} from "react-native";

const CustomButton = ({ onPress, text, type }) => {
	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;

	return (
		<TouchableOpacity onPress={onPress} style={{
			width: 340,
			borderRadius: 15,
			height: windowHeight * 0.06,
			justifyContent: "center",
			alignItems: "center",
			marginVertical: 10,
			marginTop: 5,
			backgroundColor: "black",
			shadowRadius: 1,
		}}>
			<Text style={[styles.text]}>{text}</Text>
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	container: {
		width: 340,
		borderRadius: 25,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
		marginTop: 5,
		backgroundColor: "black",
		shadowRadius: 1,
	},

	text: {
		fontWeight: "bold",
		color: "white",
	},
});
export default CustomButton;
