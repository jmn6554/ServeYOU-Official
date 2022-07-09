import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView } from "react-native";
import CustomInput from "../Components/CustomInput";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import { GooglePlacesAutocomplete, geocodeByAddress, getLatLng } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import * as geolib from 'geolib';
import CustomButton from "../Components/CustomButtons/CustomButton";
import ModalButtons from "../Components/CustomButtons/ModalButtons"
import Geocoder from 'react-native-geocoding';
import { useNavigation } from "@react-navigation/native";

const Services2 = () => {
    Geocoder.init("AIzaSyArJjEld2Et5Om2974zFHmMKKuPMXN9QAo");

    const [companyName, setcompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [userList, setUserList] = useState("");
    const [location1, setLocation1] = useState(null);
    const [data, setData] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const [Fetch, setFetch] = useState("");
    const [currentAddress, setCurrentAddress] = useState("");
    const navigation = useNavigation();


    // const addService = async () => {
    //     const db = firebase.firestore();

    //     db.collection("Users").add({
    //         companyName: "",
    //     }).then(() => { Alert.alert("Service Added") })

    // }

    useEffect(() => {
        setCurrentAddress(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }));
        console.log(currentAddress)
    }, [])

    const editUser = async (id, userType) => {
        console.log("hey")
        const db = firebase.firestore();
        const user = auth.currentUser.uid;
        db
            .collection('Users')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id == id) {
                        db.collection("Users").doc(id).set({
                            userID: user,
                            userType: userType,
                            companyName: companyName,
                            address: currentAddress._W.coords,
                        })
                        console.log("function executed")
                    }
                });
            });
    }


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const list = [];
                const db = firebase.firestore();
                const user = auth.currentUser.uid;
                await db
                    .collection('Users')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const {
                                userID,
                                userType,
                            } = doc.data();
                            if (doc.data().userID == user) {
                                list.push({
                                    id: doc.id,
                                    userID: userID,
                                    userType: userType,
                                });
                            }
                        });
                    });

                setUserList(list);
                setFetch(false);
                console.log(userList)

            } catch (e) {
                console.log(e);
            }
        };
        fetchServices();

    }, [Fetch])

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation1(location1);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location1) {
        text = JSON.stringify(location1);
    }


    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.text}>Account Setup</Text>

            <CustomInput
                placeholder="Company Name"
                value={companyName}
                setValue={setcompanyName}
                autoCorrect={false}
                autoCapitalize={"none"}
            />

            <CustomInput
                placeholder=""
                value={companyName}
                setValue={setcompanyName}
                autoCorrect={false}
                autoCapitalize={"none"}
            />

            <View style={{ height: "50%" }}>
                <GooglePlacesAutocomplete
                    styles={{
                        textInputContainer: {
                            width: 340,
                            height: 45,
                            position: "relative",
                            top: 5,
                        },

                        textInput: {
                            color: '#5d5d5d',
                            fontSize: 16,
                            borderRadius: 45,
                        },

                        listView: {
                            position: "absolute",
                            top: "13.5%",
                            width: 340,
                            borderRadius: 35
                        }
                    }}
                    placeholder='Where are you located?'
                    textInputProps={{ placeholderTextColor: '#2c4391', fontSize: "15" }}
                    minLength={2}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        Geocoder.from(data.description)
                            .then(json => {
                                var location1 = json.results[0].geometry.location;
                                setLocation1(location1);
                                console.log(data.description)
                                console.log(location1);
                            })
                            .catch(error => console.warn(error));
                    }}
                    query={{
                        key: 'AIzaSyArJjEld2Et5Om2974zFHmMKKuPMXN9QAo',
                        language: 'en',
                    }}
                />
            </View>

            <View style={styles.inputs}>
                <View style={styles.container}>
                    <FlatList
                        data={userList}
                        keyExtractor={(item) => item.id}
                        extraData={userList}
                        renderItem={({ item }) => (
                            <SafeAreaView styles={styles.container}>
                                <View style={styles.container}>

                                    <ModalButtons
                                        text="Set Info"
                                        onPress={() => { editUser(item.id, item.userType), navigation.navigate("HomeReceiver") }}
                                    />

                                </View>

                            </SafeAreaView>

                        )}
                    />
                </View>


            </View>


        </SafeAreaView>
    );
};



const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 15,
        alignItems: "center",
        width: "100%",
        height: "100%"
    },

    inputs: {
        marginTop: "10%",
    },

    text: {
        fontSize: 40,
        color: "white",
        marginTop: "15%"
    }

});
export default Services2;