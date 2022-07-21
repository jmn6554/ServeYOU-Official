import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";

const CustomButton = ({ onPress, text, type }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container]}>
            <Icon
                name="chevron-down"
                type="ionicon"
                color="white"
                size="36"
            />
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 40,
        borderRadius: 100,
        backgroundColor: "#2c4391",
        position: "absolute",
        top: 50,
        marginBottom: 20
    },

    text: {
        fontWeight: "bold",
        color: "white",
    },
});
export default CustomButton;
