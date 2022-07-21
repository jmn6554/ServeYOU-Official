import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { BackgroundImage } from "react-native-elements/dist/config";

const ModalButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container]}>
            <Icon
                name="add-circle"
                type="ionicon"
                color="#2c4391"
                size="75"
            />
            <Text style={{ flexDirection: "row", fontWeight: "bold", color: "white" }}> Add Service </Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        shadowRadius: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    text: {
        fontWeight: "bold",
        color: "white",
    },
});
export default ModalButton;