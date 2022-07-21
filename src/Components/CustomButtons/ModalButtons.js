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
        width: 340,
        borderRadius: 15,
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