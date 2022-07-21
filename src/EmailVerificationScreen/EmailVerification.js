import React, { useState, onPress, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TabBarIOSItem,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CustomButton from "../Components/CustomButtons/CustomButton";
import UserSettings from "../HomeScreenTabs/UserSettings";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, reload, currentUser } from "../../Firebase";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Button } from "react-native-elements/dist/buttons/Button";
import { TouchableHighlight } from "react-native-gesture-handler";

const EmailVerification = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;


  const resendEmail = () => {
    auth
      .currentUser.sendEmailVerification()
  };


  const returnSignIn = () => {
    auth
      .currentUser.reload()
      .then(() => {
        const user = auth.currentUser;
        console.log(user.email);
        if (user.emailVerified) {
          navigation.navigate("UserSelect");
        }
        else if (user.emailVerified === false) {
          alert("Please verify your email.")
        }

      })
      .catch((error) => alert(error.message));
  };


  return (
    <ScrollView>
      <View style={styles.container}>

        <View >
          <Ionicons
            name='mail-outline'
            type="ionicon"
            color='#2c4391'
            size='175'
          />
        </View>

        <Text style={styles.textTitle}>Account Verification</Text>

        <Text style={styles.textThanks}>A verification email has been sent to: <Text style={{ fontWeight: "bold", color: "#2c4391" }}>{auth.currentUser?.email}</Text></Text>

        <TouchableOpacity style={{ alignItems: "center" }} onPress={returnSignIn}>
          <View style={styles.button}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Proceed to Account Setup {" "}</Text>
            <Ionicons
              name="arrow-forward-circle-outline"
              type="ionicon"
              color="white"
              size="30"
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.textMargin}>
          Didn't receive an email?{" "}
          <Text style={styles.textColor} onPress={resendEmail}>
            Resend a verification link.
          </Text>
        </Text>

      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  textTitle: {
    marginBottom: 45,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    color: "#2c4391",
    marginTop: "15%",
  },

  textColor: {
    textDecorationLine: 'underline',
    fontWeight: "bold",
    color: "#2c4391"
  },

  textMargin: {
    marginTop: "45%",
  },

  textThanks: {
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    marginBottom: 45,

  },
  button: {
    justifyContent: "center",
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: "#2c4391",
    borderRadius: 5,
    height: 45,
    width: "75%"

  }
});

export default EmailVerification;
