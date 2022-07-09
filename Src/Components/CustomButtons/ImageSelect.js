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


const ImageSelect = ({ onPress, text, type }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container]}>
            <Ionicons
                name="image-outline"
                type="ionicon"
                color="#2c4391"
                size="35"
            />
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 285,
        top: "10%",
        backgroundColor: "transparent",
    },

    text: {
        fontWeight: "bold",
        color: "white",
    },
});

export default ImageSelect;
