import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, KeyboardAvoidingView, Dimensions } from "react-native";
import CustomInput from "../Components/CustomInput";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import { GooglePlacesAutocomplete, geocodeByAddress, getLatLng } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import CustomButton from "../Components/CustomButtons/CustomButton";
import ModalButtons from "../Components/CustomButtons/ModalButtons"
import Geocoder from 'react-native-geocoding';
import * as ImagePicker from 'expo-image-picker'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';

const Services2 = () => {
	Geocoder.init("AIzaSyArJjEld2Et5Om2974zFHmMKKuPMXN9QAo");
	const navigation = useNavigation();
	const [companyName, setcompanyName] = useState("");
	const [serviceCategory, setCategory] = useState("");
	const [userList, setUserList] = useState("");
	const [location1, setLocation1] = useState(null);
	const [streetAddress, setStreetAddress] = useState("");
	const [errorMsg, setErrorMsg] = useState(null);
	const [Fetch, setFetch] = useState("");
	const [image, setImage] = useState("");
	const [rangePickerValue, setRangePickerValue] = useState("");
	const height = Dimensions.get("screen").height
	const width = Dimensions.get("screen").width

	useEffect(() => {
		const fetchUserData = async () => {
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
				console.log(userList)

			} catch (e) {
				console.log(e);
			}
		};
		fetchUserData();

	}, [])


	const addNewUser = async () => {
		console.log("hey")
		const db = firebase.firestore();
		const user = auth.currentUser.uid;

		console.log(image)

		if (image != "" && image != undefined && image != null) {
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					console.log(e);
					reject(new TypeError("Network request failed"));
				};
				xhr.responseType = "blob";
				xhr.open("GET", image, true);
				xhr.send(null);
			});
			const ref1 = ref(getStorage(), "serviceBanners/" + user + companyName);
			const result = await uploadBytesResumable(ref1, blob);
			const imageURL = await getDownloadURL(ref1);

			blob.close();

			await db.collection("Users").add({
				userID: user,
				userType: "service provider",
				category: serviceCategory,
				companyName: companyName,
				address: location1,
				streetAddress: streetAddress,
				range: rangePickerValue,
				image: imageURL
			})

		}
		else {
			await db.collection("Users").add({
				userID: user,
				userType: "service provicer",
				category: serviceCategory,
				companyName: companyName,
				range: rangePickerValue,
				address: location1,
				streetAddress: streetAddress,
			})
		};
	}


	// useEffect(() => {
	//   (async () => {
	//     let { status } = await Location.requestForegroundPermissionsAsync();
	//     if (status !== 'granted') {
	//       setErrorMsg('Permission to access location was denied');
	//       return;
	//     }

	//     let location = await Location.getCurrentPositionAsync({});
	//     setLocation1(location1);
	//   })();
	// }, []);

	// let text = 'Waiting..';
	// if (errorMsg) {
	//   text = errorMsg;
	// } else if (location1) {
	//   text = JSON.stringify(location1);
	// }

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.5,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};


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
				placeholder="Category of Service"
				value={serviceCategory}
				setValue={setCategory}
				autoCorrect={false}
				autoCapitalize={"none"}
			/>

			<RNPickerSelect
				style={pickerStyle}
				placeholder={{ label: "Select a range...", value: "default" }}
				onValueChange={(value) => setRangePickerValue(value)}
				items={[
					{ label: '5 km', value: '5' },
					{ label: '10 km', value: '10' },
					{ label: '25 km', value: '25' },
					{ label: '50 km', value: '50' },
					{ label: '75 km', value: '75' },
					{ label: '100 km', value: '100' },
					{ label: '150 km', value: '150' },
					{ label: '200 km', value: '200' },
				]}
			/>

			<View style={{ height: "50%" }}>
				<GooglePlacesAutocomplete
					styles={{
						textInputContainer: {
							width: width * 0.87,
							height: height * 0.06,
							borderColor: "black",
							borderRadius: 20,
						},

						textInput: {
							width: width * 0.87,
							height: height * 0.06,
							fontSize: 20,
							borderRadius: 10,
							marginTop: 7,
							borderWidth: 0.3,
							backgroundColor: "white"
						},

						listView: {
							width: width * 0.87,
							borderWidth: 0.5,
							alignContent: "center",
							borderRadius: 20,
							marginTop: 10
						}
					}}
					placeholder='Where are you located?'
					textInputProps={{ placeholderTextColor: 'black', fontSize: "15" }}
					minLength={2}
					onPress={(data, details = null) => {
						// 'details' is provided when fetchDetails = true
						setStreetAddress(data.description)
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

			<ModalButtons onPress={pickImage} text="Add Banner" />
			<ModalButtons text="Complete Setup" onPress={() => { addNewUser(), navigation.navigate("HomeProvider") }} />


		</SafeAreaView>
	);
};

const pickerStyle = {
	inputIOS: {
		height: Dimensions.get("window").height * 0.06,
		width: Dimensions.get("window").width * 0.87,
		marginTop: Dimensions.get("window").height * 0.005,
		marginLeft: Dimensions.get("window").width * 0.065,
		color: "black",
		paddingTop: 13,
		paddingHorizontal: 10,
		paddingBottom: 12,
		borderWidth: 0.35,
		borderRadius: 10,
	},
	inputAndroid: {
		color: 'white',
	},
	placeholder: {
		color: "black"
	},
	underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: 'black',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 20,
		right: 15,
	},
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
		marginBottom: 30,
		color: "black",
		marginTop: "7%"
	}

});
export default Services2;