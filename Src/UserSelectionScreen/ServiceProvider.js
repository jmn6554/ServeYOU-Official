import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, KeyboardAvoidingView } from "react-native";
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
				setFetch(false);
				console.log(userList)

			} catch (e) {
				console.log(e);
			}
		};
		fetchUserData();

	}, [Fetch])


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
				image: imageURL
			})

		}
		else {
			await db.collection("Users").add({
				userID: user,
				userType: "service provicer",
				category: serviceCategory,
				companyName: companyName,
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
			aspect: [1, 1],
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
							color: 'black',
							fontSize: 16,
							borderRadius: 45,
						},

						listView: {
							position: "absolute",
							top: "13.5%",
							width: 340,
							borderRadius: 35,
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

			{/* <View style={styles.inputs}>
				<View style={styles.container}>
					<FlatList
						data={userList}
						keyExtractor={(item) => item.id}
						extraData={userList}
						renderItem={({ item }) => (
							<SafeAreaView styles={styles.container}>
								<View style={styles.container}>

		

								</View>

							</SafeAreaView>

						)}
					/>
				</View>


			</View> */}


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
		color: "black",
		marginTop: "15%"
	}

});
export default Services2;