import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TabBarIOSItem,
  TouchableOpacity
} from "react-native";
import { Modal } from "react-native-paper";
import CustomButton from "../Components/CustomButtons/CustomButton";
import CustomInput from "../Components/CustomInput";
import ModalButtons from "../Components/CustomButtons/ModalButtons"
import GestureRecognizer from 'react-native-swipe-gestures';
import DropDownPicker from 'react-native-dropdown-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';


const UserSelect = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Receive Services', value: 'service receiver' },
    { label: 'Provide Services', value: 'service provider' }
  ]);

  const navigation = useNavigation();

  const navigate = () => {
    navigation.navigate("SignUp")
  }

  const addUser = async (type) => {
    const db = firebase.firestore();
    const user = auth.currentUser.uid;
    db.collection("Users").add({
      userType: type,
      userID: user,
    }).then(() => console.log("Added"))

  }



  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.text}>Getting Started</Text>
      <Text style={{ fontSize: 25, color: "black", position: "absolute", top: "50%" }}>Tell us what you're looking for</Text>

      <DropDownPicker
        containerStyle={{
          width: "65%",
          position: "absolute",
          top: "55%"
        }}
        placeholderStyle={{
          fontWeight: "bold"
        }}
        placeholder="Select One"
        mode="BADGE"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onSelectItem={(item) => {
          if (item.label == "Provide Services") {
            // addUser(item.value);
            navigation.navigate("ServiceProvider");
          }
          else if (item.label == "Receive Services") {
            // addUser(item.value);
            navigation.navigate("ServiceReceiver");
          }
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  container2: {
    // flex: 2,
    position: "absolute",
    top: 300,
    height: "100%",
    width: "100%",

  },

  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 40,
    position: "absolute",
    top: "10%"
  },


  container3: {
    top: "5%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },


  modalView: {
    height: "100%",
    width: "100%",
    alignContent: "center",
    position: "absolute",
    borderRadius: 20,
    backgroundColor: "#2c4391",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },



});

export default UserSelect;