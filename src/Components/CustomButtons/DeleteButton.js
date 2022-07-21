import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


const CustomButton = ({ onPress, text, type }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container]}>
            <Ionicons
                name="trash"
                type="ionicon"
                color="black"
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
        backgroundColor: "transparent",
        shadowRadius: 1,
    },

    text: {
        fontWeight: "bold",
        color: "white",
    },
});

export default CustomButton;
