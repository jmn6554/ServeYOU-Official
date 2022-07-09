import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Availabilities1 = ({ onPress, text, type }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    return (
        <TouchableOpacity onPress={onPress} style={{
            width: 340,
            borderRadius: 25,
            height: windowHeight * 0.06,
            justifyContent: "center",
            alignItems: "center",
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
        width: 300,
        borderRadius: 25,
        height: 40,
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
export default Availabilities1;