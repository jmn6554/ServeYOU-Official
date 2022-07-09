import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
} from "react-native";

const CustomButton = ({ onPress, text, type }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container]}>
            <Text style={[styles.text]}>{text}</Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        width: 100,
        borderRadius: 45,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        marginTop: 5,
        backgroundColor: "white",
        shadowRadius: 1,
    },

    text: {
        fontWeight: "bold",
        color: "#2c4391",
    },
});
export default CustomButton;