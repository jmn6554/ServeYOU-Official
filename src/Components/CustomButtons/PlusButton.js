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
                name="add-circle"
                type="ionicon"
                color="black"
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
        backgroundColor: "transparent",

    },

    text: {
        fontWeight: "bold",
        color: "white",
    },
});
export default CustomButton;
