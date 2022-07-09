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
                name="ellipsis-horizontal"
                type="ionicon"
                color="#2c4391"
                size="25"
            />
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        width: 30,
        height: 45,
        borderRadius: 25,
        marginVertical: 10,
        marginLeft: 285,
        backgroundColor: "white",
        shadowRadius: 1,
    },

    text: {
        fontWeight: "bold",
        color: "white",
    },
});

export default CustomButton;
