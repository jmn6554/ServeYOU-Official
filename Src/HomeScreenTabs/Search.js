import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, TouchableOpacity, Pressable, RefreshControl, TextInput, Keyboard } from "react-native";
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
import SearchBar from "react-native-dynamic-search-bar";

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
	const [filterList, setFilterList] = useState("");
	const [value, setValue] = useState("");


	useEffect(() => {
		const myInterval = setInterval(() => {
			setFetch(!Fetch)
			timesrun += 1;

			if (timesrun < 1) {
				console.log("hey")
				// setCurrentAddress(Location.getCurrentPositionAsync({}));
				// console.log(currentAddress)
			}
			else if (timesrun > 1) {
				// fetchServices();
				clearInterval(myInterval);
				// console.log(currentAddress)
			}


		}, 500)
	}, [intervals]);

	useLayoutEffect(() => {
		console.log("useeffect called")
		const fetchAddress = async () => {
			try {
				const list = [];
				const db = firebase.firestore();
				const user = auth.currentUser.uid;
				db
					.collection('Users')
					.orderBy("companyName")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const {
								address,
								userID,
							} = doc.data();
							if (doc.data().userID == user) {
								setCurrentAddress(doc.data().address)
							}
						});
					});



			} catch (e) {
				console.log(e);
			}
		}

		fetchAddress();
		if (typeof currentAddress != null) {
			fetchServices();
		}
		else {
			fetchAddress();
		}


	}, [Fetch])


	// useEffect(() => {
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
						setAddress(doc.data().address)
						console.log(address)
						if (geolib.isPointWithinRadius(
							currentAddress,
							address,
							500000
						) && doc.data().userType == "service provider") {
							console.log("hey")
							list.push({
								id: doc.id,
								userID: userID,
								companyName: companyName,
								address: address,
								streetAddress: streetAddress,
								image: Image,
								distance: geolib.getDistance(address, currentAddress, 100) / 1000
							});
						}
					});
				});
			setServiceList(list);
		} catch (e) {
			console.log(e);
		}

	};

	useEffect(() => {
		const getUsers = async () => {
			console.log("use effect called")
			try {
				const user = auth.currentUser.uid;
				const db = firebase.firestore();
				await db
					.collection('Users')
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							if (doc.data().userID == user) {
								setName(doc.data().companyName)
							}

						});
					});

			} catch (e) {
				console.log(e);
			}
		};
		getUsers();
	}, [])

	const searchServices = async () => {
		console.log("function called")
		console.log(filterList.current)
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Users')
				.where("category", "==", filterList)
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
						setAddress(doc.data().address)
						console.log(address)
						if (geolib.isPointWithinRadius(
							currentAddress,
							address,
							500000
						) && doc.data().userType == "service provider") {
							console.log("hey")
							list.push({
								id: doc.id,
								userID: userID,
								companyName: companyName,
								address: address,
								streetAddress: streetAddress,
								image: Image,
								distance: geolib.getDistance(address, currentAddress, 100) / 1000
							});
						}
					});
				});
			setServiceList(list);
		} catch (e) {
			console.log(e);
		}

	};


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
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold", position: "absolute", left: 10, top: 20 }}>Discover</Text>
				<SafeAreaView style={{ position: "absolute", right: 10, bottom: 5 }}>
					<SearchBar
						style={{ width: 250, backgroundColor: "#d1d4e0", borderRadius: 5 }}
						maxLength={35}
						fontColor="black"
						iconColor="#cad0d9"
						shadowColor="#282828"
						cancelIconColor="#c6c6c6"
						placeholder="Search here"
						onChangeText={(text) => { setFilterList(text), console.log(filterList) }}
						onSearchPress={() => searchServices()}
						onClearPress={() => { fetchServices(), setFilterList("") }}
						onPress={() => console.log("pressed")}
						returnKeyType='search'
						enablesReturnKeyAutomatically={true}
						onSubmitEditing={() => { searchServices() }}
					/>

				</SafeAreaView>

			</View>

			<SafeAreaView style={styles.container2}>
				<FlatList
					refreshControl=
					{<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="black"
						colors={['transparent']}
						style={{ backgroundColor: "transparent" }}
					/>}
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

									<Text style={{ color: "black", fontWeight: "bold", marginTop: "40%", flexDirection: "column" }} >
										<Text style={{ color: "black", fontSize: 25 }}> {item.companyName}  </Text>
									</Text>
									<Text style={{ color: "black", fontSize: 15 }}> {item.streetAddress} </Text>
									<Text style={{ color: "black", fontSize: 14, fontWeight: "bold", position: "absolute", bottom: 10, right: 15 }}> {item.distance}KM </Text>
								</View>


							</SafeAreaView>
						</Pressable>

					)}
				/>

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

	containerInputs: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: "100%",
		marginTop: 20

	},


	modalView: {
		height: "100%",
		width: "100%",
		alignContent: "center",
		marginTop: "25%",
		margin: 0,
		borderRadius: 70,
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

	modalView2: {
		height: "100%",
		width: "100%",
		alignContent: "center",
		marginTop: "25%",
		margin: 0,
		borderRadius: 70,
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

	serviceHolder: {
		width: 390,
		height: 250,
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
		borderRadius: 20,
	},

	tinyLogo: {
		width: 390,
		height: 155,
		position: "absolute",
		borderRadius: 20,
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