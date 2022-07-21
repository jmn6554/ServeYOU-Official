import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import CustomInput from "../Components/CustomInput/CustomInput";
import CustomButton from "../Components/CustomButtons";
import CustomButton2 from "../Components/CustomButtons/CustomButton2";
import CustomButton3 from "../Components/CustomButtons/CustomButton3";
import CustomButton4 from "../Components/CustomButtons/CustomButton4";
import CustomButton5 from "../Components/CustomButtons/CustomButton5";
import CustomButton6 from "../Components/CustomButtons/CustomButton6";
import EmailVerification from "../EmailVerificationScreen/EmailVerification";
import { auth } from "../../Firebase";
import { sendEmailVerification } from "firebase/auth";
import { Controller, control } from "react-hook-form";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { render } from "react-dom";
import { Button } from "react-native-elements/dist/buttons/Button";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigation = useNavigation();


  const handleSignUp = () => {

    if (
      password === passwordConfirm &&
      password.length > 8 &&
      password.length < 20
    ) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          userCredentials.user.sendEmailVerification();
          const user = userCredentials.user;
          navigation.navigate("VerifyEmail")
        })
        .catch((error) => alert(error.message));
    }

    else if (password.length < 8 && password === passwordConfirm) {
      alert("Password length must greater than 8 characters.");
    } else if (password.length > 20 && password === passwordConfirm)
      alert("Password length must be less than 20 characters.");
    else {
      alert("Password and confirmation password do not match!");
    }
  };



  const onRegisterPressed = () => {
    console.warn("Account Created");
  };
  const onForgotPasswordPressed = () => {
    console.warn("Forgot Password");
  };
  const onSignInWithFacebook = () => {
    console.warn("FaceBook Sign In");
  };
  const onSignInWithGoogle = () => {
    console.warn("Google Sign In");
  };
  const onSignInWithApple = () => {
    console.warn("Apple Sign In");
  };
  const onCreateAnAccount = () => {
    console.warn("Create an Account");
  };
  const onTermsOfUse = () => {
    console.warn("Terms of Use accepted");
  };
  const onPrivacy = () => {
    console.warn("Privacy accepted");
  };

  return (
    <ScrollView showsVerticalScrollIndicator>
      <View style={styles.root}>
        <Text style={styles.text_Logo}> Create an Account </Text>

        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
          autoCorrect={false}
          autoCapitalize={"none"}
          control={control}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize={"none"}
          control={control}
        />
        <CustomInput
          placeholder="Confirm Password"
          value={passwordConfirm}
          setValue={setPasswordConfirm}
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize={"none"}
          control={control}
        />
        <CustomButton text="Register" onPress={handleSignUp} type="primary" />

        <Text style={styles.text}>
          By registering, I confirm that I have read and accepted the {""}
          <Text style={styles.link} onPress={onTermsOfUse}>

            Terms of Use{" "}
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={onPrivacy}>
            Privacy Policy.{" "}
          </Text>
        </Text>

        {/* <CustomButton3
          text="Sign Up with Facebook"
          onPress={onSignInWithFacebook}
        />
         <CustomButton4 
          text="Sign Up with Google"
          onPress={onSignInWithGoogle}
        />
        <CustomButton5 text="Sign Up with Apple" onPress={onSignInWithApple} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 10,
    width: "100%",
    justifyContent: "center",
    marginTop: "50%"
  },

  text_Logo: {
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
    marginBottom: 50,
  },
  text: {
    marginTop: 10,
    marginBottom: 40,
    margin: 10,
  },

  link: {
    textDecorationLine: 'underline',
    fontWeight: "bold",
    color: "#2c4391",
  },
});

export default SignUpScreen;
