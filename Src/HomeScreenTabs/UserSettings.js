import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, TouchableOpacity, Pressable, RefreshControl } from "react-native";
import DownPicker from "../Components/CustomButtons/DownPicker";
import OptionsButton from "../Components/CustomButtons/OptionButton"
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import GetLocation from 'react-native-get-location'
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as ImagePicker from 'expo-image-picker'
import * as geolib from 'geolib';
import * as Location from 'expo-location';
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import * as Haptics from 'expo-haptics';
import * as Progress from 'react-native-progress';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
// import SearchBar from "react-native-dynamic-search-bar";
import CustomButton from '../Components/CustomButtons/CustomButton';

const Services2 = (trigger) => {
  const [address, setAddress] = useState("");
  const [serviceList, setServiceList] = useState("");
  var [currentAddress, setCurrentAddress] = useState(null);
  const [Fetch, setFetch] = useState(true);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  var timesrun = 0;
  const [intervals, setIntervals] = useState(true);
  const [name, setName] = useState("");
  const [filterList, setFilterList] = useState("")
  // useEffect(() => {
  //   const myInterval = setInterval(() => {
  //     setFetch(!Fetch)
  //     timesrun += 1;

  //     if (timesrun < 1) {
  //       console.log("hey")
  //       // setCurrentAddress(Location.getCurrentPositionAsync({}));
  //       // console.log(currentAddress)
  //     }
  //     else if (timesrun > 1) {
  //       // fetchServices();
  //       clearInterval(myInterval);
  //       // console.log(currentAddress)
  //     }


  //   }, 500)
  // }, [intervals]);

  console.log(auth.currentUser.email)

  useEffect(() => {
    const fetchServices = async () => {
      console.log("function called")
      try {
        const list = [];
        const db = firebase.firestore();
        const user = auth.currentUser.uid;
        await db
          .collection('Users')
          .orderBy("companyName")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const {
                address,
                streetAddress,
                companyName,
                userID,
                userType,
                Image,
              } = doc.data();
              if (doc.data().userID == user) {
                console.log("hey")
                list.push({
                  id: doc.id,
                  userID: userID,
                  companyName: companyName,
                  address: address,
                  streetAddress: streetAddress,
                  image: Image,
                });
              }
            });
          });
        setServiceList(list);
      } catch (e) {
        console.log(e);
      }
    };
    fetchServices();
  }, [])

  console.log("hey")



  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    console.log("refreshed")
    console.log(currentAddress)
    if (currentAddress != null) {
      fetchServices();
    }
    else {
      setIntervals(false)
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);


  return (
    <SafeAreaView style={styles.container} >

      <View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
        <Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Settings</Text>
        <SafeAreaView style={{ position: "absolute", right: 10, bottom: 5 }}>
        </SafeAreaView>
      </View>


      <SafeAreaView style={styles.container2}>
        <CustomButton text="Sign Out" onPress={() => { navigation.navigate("SignIn"), auth.signOut() }} />
        <ScrollView>
          {/* <FlatList
            data={serviceList}
            keyExtractor={(item) => item.id}
            extraData={serviceList}
            ListFooterComponent={<View style={{ height: 90 }} />}
            renderItem={({ item, separators }) => (
              <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), navigation.navigate("ServicePage", { userID: item.userID, docID: item.id, companyName: item.companyName, currName: name }) }} >
                <SafeAreaView >

                  <View style={styles.serviceHolder}>

                    <Image style={styles.tinyLogo}
                      source={{
                        uri: item.image,
                      }}
                    />

                    <Text style={{ color: "black", fontWeight: "bold", flexDirection: "column" }} >
                      <Text style={{ color: "black", fontSize: 25 }}> {item.companyName}  </Text>
                    </Text>
                    <Text style={{ color: "black", fontSize: 15 }}> {item.streetAddress} </Text>
                  </View>


                </SafeAreaView>
              </Pressable>
            )}
          /> */}

        </ScrollView>

      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    width: "100%",
    height: "100%"
  },

  container2: {

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    padding: 15,
    width: "100%",
    height: "100%",
    marginTop: 20,
    position: "relative",
    top: "4.35%"

  },

  container3: {

    top: "5%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },

  serviceHolder: {
    width: 390,
    height: 70,
    marginBottom: 3,
    backgroundColor: "#ffffff",
    alignContent: "flex-start",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },

  tinyLogo: {
    width: 390,
    height: 155,
    position: "absolute",
    borderRadius: 2,
  },

  edit: {
    position: "absolute",
    bottom: 50,
    right: 5,

  },

  delete: {
    position: "absolute",
    bottom: 0,
    right: 5,

  },

  text: {
    marginTop: 650,
  },


});
export default Services2;