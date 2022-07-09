import React from "react";
import {
	TextInput,
	View,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
	SafeAreaView,
	Platform,
	SafeAreaViewComponent,
	Dimensions,
} from "react-native";
import { Controller, FormProvider } from "react-hook-form";

const CustomInput = ({
	value,
	setValue,
	placeholder,
	secureTextEntry,
	autoCorrect,
	autoCapitalize,
}) => {
	return (
		<View style={styles.container}>
			<TextInput
				placeholderTextColor="black"
				value={value}
				onChangeText={setValue}
				placeholder={placeholder}
				style={styles.input}
				secureTextEntry={secureTextEntry}
				autoCorrect={autoCorrect}
				autoCapitalize={autoCapitalize}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		width: Dimensions.get("screen").width * 0.87,
		height: Dimensions.get("screen").height * 0.06,
		borderColor: "black",
		borderRadius: 10,
		borderWidth: 0.35,
		paddingHorizontal: 10,
		marginVertical: 5,
		justifyContent: "center",
	},
	input: { borderColor: "#2c4391", },
});

export default CustomInput;
