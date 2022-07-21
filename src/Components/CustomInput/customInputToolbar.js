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
} from "react-native";
import { Controller, FormProvider } from "react-hook-form";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";

const customtInputToolbar = props => {
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                justifyContent: "center",
                height: 40,
                width: "100%",
                backgroundColor: "white",
                borderTopColor: "#E8E8E8",
                borderBottomColor: "#E8E8E8",
                borderTopWidth: 0.5,
                borderBottomWidth: 0.5,
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: 340,
        height: 45,
        borderColor: "#2c4391",
        borderRadius: 10,
        borderWidth: 0.35,
        paddingHorizontal: 10,
        marginVertical: 5,
        justifyContent: "center",
    },
    input: { borderColor: "#2c4391", },
});

export default customtInputToolbar;
