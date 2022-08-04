import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, TouchableOpacity, Pressable, RefreshControl, SectionList, Keyboard, KeyboardAvoidingView } from "react-native";
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
import { useNavigation, NavigationContainer, useIsFocused, ref } from "@react-navigation/native";
import * as Haptics from 'expo-haptics';
// import { Permissions, Request } from 'expo-permissions'
import SearchBar from "react-native-dynamic-search-bar";
import LottieView from 'lottie-react-native';
import Geocoder from 'react-native-geocoding';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import CustomButton from '../Components/CustomButtons/CustomButton';
import XButton from "../Components/CustomButtons/XButton"
import { SwipeListView } from 'react-native-swipe-list-view';
import { Dimensions } from 'react-native';
import { list } from 'firebase/storage';

const Services2 = (trigger) => {
	Geocoder.init("AIzaSyArJjEld2Et5Om2974zFHmMKKuPMXN9QAo");
	const [address, setAddress] = useState("");
	const [serviceList, setServiceList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);
	const [currentAddress, setCurrentAddress] = useState(null);
	const [recentLocations, setRecentLocations] = useState([]);
	var newLocation = React.useRef("");
	let streetAddress = React.useRef("");
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = useState(false);
	var timesrun = 0;
	const [intervals, setIntervals] = useState(true);
	const [name, setName] = useState("");
	const [searchBarInput, setSearchBarInput] = useState("");
	var count = 0;
	const [loading, setLoading] = useState(true)
	const isFocused = useIsFocused();
	const ref = React.useRef();
	const [modalVisible, setModalVisible] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	const windowWidth = Dimensions.get('screen').width;
	const windowHeight = Dimensions.get('screen').height;
	const [currentUserDocID, setCurrentUserDocID] = useState("");

	useEffect(() => {
		if (isFocused && serviceList != "" || serviceList != null || serviceList != undefined) {
			ref.current?.play();
			// setLoading(false);
		}
	}, [isFocused, ref.current]);


	useEffect(async () => {
		if (isFocused) {
			ref.current?.play();
		}
		const permissionChecker = async () => {
			if (Platform.OS !== "web") {
				const { status } = await Location.requestForegroundPermissionsAsync();

				if (status !== "granted") {
					Alert.alert(
						"Insufficient permissions!",
						"Please enable location permissions",
						[{ text: "Okay" }]
					);
				}
				else {
					// await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Medium }).then(loc => { fetchServices(loc), setCurrentAddress(loc), Geocoder.from(loc.coords).then(address => streetAddress.current = address.results[0].address_components[0].long_name + " " + address.results[0].address_components[1].long_name), fetchRecentLocations() });
					await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Balanced }).then(loc => { locationSetting(loc) });
					// console.log(recentLocations);
				}
				return;
			}
		}
		permissionChecker()

	}, []);

	const locationSetting = async (loc) => {

		setCurrentAddress(loc);
		await Geocoder.from(loc.coords).then(address => { streetAddress.current = address.results[0].address_components[0].long_name + " " + address.results[0].address_components[1].long_name });
		await fetchServices(loc);
		await fetchRecentLocations();
		setLoading(false);

	}

	const fetchServices = async (loc) => {
		console.log(loc)
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Users')
				.where('userType', '==', 'service provider')
				.where('range', '<', "250")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						// console.log(doc.data().companyName)
						const {
							address,
							streetAddress,
							companyName,
							userID,
							userType,
							image,
							category
						} = doc.data();
						if (geolib.isPointWithinRadius(
							loc.coords,
							address,
							500000
						)) {
							list.push({
								title: category,
								data: [{
									id: doc.id,
									userID: userID,
									companyName: companyName,
									address: address,
									streetAddress: streetAddress,
									image: image,
									distance: geolib.getDistance(address, loc.coords, 100) / 1000,
								}]
							});
						}
					});
				});

			var filter_data = {};
			list.forEach(e => {
				// console.log(e.data)
				if (filter_data[e.title] != undefined) {
					filter_data[e.title].data = [...filter_data[e.title].data, ...e.data]
				} else {
					filter_data[e.title] = e;
				}
			});

			var _data = Object.values(filter_data);

			setServiceList(_data);

		} catch (e) {
			console.log(e);
		}

	};


	const fetchServicesUpdatedAddress = async (loc) => {
		console.log(loc)
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Users')
				.where('userType', '==', 'service provider')
				.orderBy('category')
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						// console.log(doc.data().companyName)
						const {
							address,
							streetAddress,
							companyName,
							userID,
							userType,
							image,
							category
						} = doc.data();
						if (geolib.isPointWithinRadius(
							loc,
							address,
							5000000
						)) {
							list.push({
								title: category,
								data: [{
									id: doc.id,
									userID: userID,
									companyName: companyName,
									address: address,
									streetAddress: streetAddress,
									image: image,
									distance: geolib.getDistance(address, loc, 100) / 1000,
								}]
							});
						}
					});
				});

			var filter_data = {};
			list.forEach(e => {
				// console.log(e.data)
				if (filter_data[e.title] != undefined) {
					filter_data[e.title].data = [...filter_data[e.title].data, ...e.data]
				} else {
					filter_data[e.title] = e;
				}
			});

			var _data = Object.values(filter_data);

			setServiceList(_data);

		} catch (e) {
			console.log(e);
		}

	};

	const clearServiceList = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Users')
				.orderBy("category")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						const {
							address,
							streetAddress,
							companyName,
							userID,
							userType,
							image,
							category
						} = doc.data();
						setAddress(doc.data().address)
						if (geolib.isPointWithinRadius(
							currentAddress.coords,
							address,
							5000000
						) && doc.data().userType == "service provider") {
							list.push({
								title: category,
								data: [{
									id: doc.id,
									userID: userID,
									companyName: companyName,
									address: address,
									streetAddress: streetAddress,
									image: image,
									distance: geolib.getDistance(address, currentAddress.coords, 100) / 1000,
								}]
							});
						}
					});
				});

			var filter_data = {};
			list.forEach(e => {
				// console.log(e.data)
				if (filter_data[e.title] != undefined) {
					filter_data[e.title].data = [...filter_data[e.title].data, ...e.data]
				} else {
					filter_data[e.title] = e;
				}
			});

			var _data = Object.values(filter_data);

			setServiceList(_data);
			setFilteredList(_data);

		} catch (e) {
			console.log(e);
		}

	};

	const serviceListFilter = () => {
		var searchFilterArray = [];
		serviceList.forEach(e => {
			if (e.title == searchBarInput) {
				setServiceList(serviceList.splice(serviceList.indexOf(e), 1));
				// console.log(serviceList)
			}
		})
	}

	const fetchRecentLocations = async () => {
		var recentLocationsTemp = [];
		const db = firebase.firestore();
		await db
			.collection('Users')
			.where("userID", "==", auth.currentUser.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setCurrentUserDocID(doc.id);
					console.log(doc.id)

					if (doc.data().recentLocations != undefined) {
						recentLocationsTemp = doc.data().recentLocations;
					}

					else if (doc.data().recentLocations == undefined) {
						recentLocationsTemp = [];
					}
				});
				setRecentLocations(recentLocationsTemp);
			});
	}

	const addLocationToRecents = async (location) => {
		recentLocations.push(location)
		const db = firebase.firestore();
		await db
			.collection('Users')
			.where("userID", "==", auth.currentUser.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					db.collection("Users").doc(doc.id).update({ recentLocations: recentLocations })
				});
			});
	}

	const deleteRecentLocation = async (rowID) => {
		const db = firebase.firestore();
		recentLocations.splice(rowID, 1);
		setRecentLocations([...recentLocations]);
		await db.collection("Users").doc(currentUserDocID).update({ recentLocations: recentLocations });
		fetchRecentLocations();

	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		if (currentAddress != null) {
			fetchServices(currentAddress);
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
			{loading == true ? <LottieView source={require("../../assets/50738-loading-line.json")} autoPlay loop ref={ref} /> : null}

			<View style={{ backgroundColor: "white", height: 150, width: 400, justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<View style={{ position: "absolute", top: "30%", left: "5%" }}>
					<Text style={{ color: "black", fontSize: 30, fontWeight: "bold" }}>Services</Text>
				</View>

				<View style={{ marginTop: 100, marginLeft: 10, flexDirection: "row" }}>
					<Pressable onPress={() => setModalVisible(true)}>
						<Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>Your Location • {streetAddress.current}</Text>
					</Pressable>
					<View style={{ justifyContent: "center" }}>
						<Ionicons
							name="chevron-down"
							type="ionicon"
							color="black"
							size="25"
						/>
					</View>
				</View>



				<SafeAreaView style={{ position: "absolute", right: 10, bottom: 60 }}>
					<SearchBar
						style={{ width: 200, height: 40, backgroundColor: "#d1d4e0", borderRadius: 5 }}
						maxLength={35}
						fontColor="black"
						iconColor="#cad0d9"
						shadowColor="#282828"
						cancelIconColor="#c6c6c6"
						placeholder="Search here"
						onChangeText={(text) => { setSearchBarInput(text) }}
						onSearchPress={() => serviceListFilter()}
						onClearPress={() => { setSearchBarInput(""), clearServiceList() }}
						onPress={() => console.log("pressed")}
						returnKeyType='search'
						enablesReturnKeyAutomatically={true}
						onSubmitEditing={() => { serviceListFilter() }}
					/>

				</SafeAreaView>

			</View>

			{loading == false ? <SafeAreaView style={styles.container2}>
				<SafeAreaView>
					<SectionList
						refreshControl={<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="black"
							colors={['transparent']}
							style={{ backgroundColor: "transparent" }}
						/>}
						showsVerticalScrollIndicator={false}
						sections={serviceList}
						stickySectionHeadersEnabled
						keyExtractor={(item) => item.id}
						extraData={serviceList}
						renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
						ListFooterComponent={<View style={{ height: 145 }} />}
						renderItem={({ item, separators }) => (
							<Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), navigation.navigate("ServicePage", { userID: item.userID, docID: item.id, companyName: item.companyName, currName: name }) }} >
								<SafeAreaView >

									<View style={styles.serviceHolder}>

										<Image style={styles.tinyLogo}
											source={{
												uri: item.image,
											}}
										/>

										<Text style={{ color: "black", marginTop: "40%", flexDirection: "row" }} >
											<Text style={{ color: "black", fontSize: 23, fontWeight: "bold", }}> {item.companyName} </Text>
										</Text>
										<Text style={{ color: "black", fontSize: 15 }}> {item.streetAddress} </Text>
										<Text style={{ color: "black", fontSize: 14, fontWeight: "bold", position: "absolute", bottom: 10, right: 15 }}> {item.distance}KM </Text>
									</View>

								</SafeAreaView>
							</Pressable>
						)}
					/>
				</SafeAreaView>

			</SafeAreaView> : null}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalVisible(!modalVisible);
				}}
			>
				<Pressable onPress={() => Keyboard.dismiss()}>
					<View style={styles.modalView}>
						<View style={styles.container3}>
							<Text style={{ fontSize: 25, fontWeight: "bold", color: "black" }}>Location</Text>
						</View>

						<Text style={{ fontSize: 20, position: "absolute", top: windowHeight * 0.19, left: 0, fontWeight: "bold" }}>Recent Locations</Text>

						<View style={{ alignSelf: "center", position: "absolute", bottom: windowHeight * 0.15 }}>
							<CustomButton text="Save" onPress={() => { setModalVisible(false), addLocationToRecents(newLocation.current) }} />
						</View>
						<XButton onPress={() => setModalVisible(false)}></XButton>

						<View style={{ backgroundColor: "transparent", height: 500 }}>

							<View style={{ position: "absolute", top: windowHeight * 0.15 }}>

								<SwipeListView
									useFlatList
									// style={{ position: "absolute", top: windowHeight * 0.15, zIndex: 1 }}
									data={recentLocations}
									keyExtractor={(item) => item.id}
									extraData={recentLocations}
									ListFooterComponent={<View style={{ height: 0 }} />}
									renderItem={({ item }) => (
										<SafeAreaView >
											<View style={{ width: windowWidth * 1, height: windowHeight * 0.07, backgroundColor: "white", borderBottomWidth: 0.6, justifyContent: "center", marginBottom: 3 }}>
												<Text style={{ fontSize: 20 }}> {item.streetAddress} </Text>

											</View>
										</SafeAreaView>
									)}
									renderHiddenItem={(item, rowMap) => (
										<TouchableOpacity onPress={() => { deleteRecentLocation(item.index), rowMap[item.item.id].closeRow() }}>
											<View style={{ backgroundColor: "red", height: windowHeight * 0.07, width: 90, borderRadius: 0, position: "absolute", right: 0, justifyContent: "center", alignItems: "center" }}>
												{/* <View style={{ position: "absolute" }}> */}
												<Text style={{ fontSize: 20, fontWeight: "500", color: "white" }}>Delete</Text>
												{/* </View> */}
											</View>
										</TouchableOpacity>
									)}
									rightOpenValue={-100}
									stopRightSwipe={-100}
									disableRightSwipe={true}

								/>

							</View>

							<GooglePlacesAutocomplete
								styles={{
									textInputContainer: {
										width: 380,
										height: 80,
										borderColor: "black",
										borderRadius: 15,
									},

									textInput: {
										width: "90%",
										height: 60,
										fontSize: 20,
										borderRadius: 15,
										marginTop: 7,
										borderWidth: 0.3,
										backgroundColor: "#E8E8E8"
									},

									listView: {
										width: windowWidth * 0.97,
										height: windowHeight * 0.2,
										borderWidth: 0.5,
										alignContent: "center",
										borderRadius: 15,
									}
								}}
								placeholder='Enter a new address'
								textInputProps={{ placeholderTextColor: 'black', fontSize: "15" }}
								minLength={2}
								onPress={(data, details = null) => {
									// 'details' is provided when fetchDetails = true
									// setStreetAddress(data.description)
									Geocoder.from(data.description)
										.then(json => {
											var fetchServicesLocation = json.results[0].geometry.location;
											var displayedLocation = json.results[0].address_components[0].long_name + " " + json.results[0].address_components[1].long_name;
											newLocation.current = { coords: json.results[0].geometry.location, streetAddress: displayedLocation };

											streetAddress.current = displayedLocation;
											fetchServicesUpdatedAddress(fetchServicesLocation);
										})
										.catch(error => console.warn(error));
								}}
								query={{
									key: 'AIzaSyArJjEld2Et5Om2974zFHmMKKuPMXN9QAo',
									language: 'en',
								}}
							/>

						</View>

					</View>
				</Pressable>

			</Modal>

		</SafeAreaView >
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
		marginTop: 195,
		// position: "relative",
		// top: "4.35%"

	},

	container3: {
		alignContent: "center",
		alignItems: "center",
		marginTop: "10%"
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
		height: Dimensions.get("window").height,
		width: "100%",
		alignContent: "center",
		alignItems: "center",
		marginTop: "20%",
		backgroundColor: "white",
	},

	serviceHolder: {
		width: Dimensions.get("window").width * 0.93,
		height: Dimensions.get("window").height * 0.3,
		marginBottom: 3,
		backgroundColor: "#ebedf0",
		alignContent: "flex-start",
		borderRadius: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.30,
		shadowRadius: 2,

		elevation: 8,
		borderRadius: 20,
	},

	tinyLogo: {
		width: Dimensions.get("window").width * 0.93,
		height: Dimensions.get("window").height * 0.17,
		position: "absolute",
		borderRadius: 20,
	},

	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8
	},
	header: {
		fontSize: 32,
		backgroundColor: "#fff"
	},
	title: {
		fontSize: 30
	},


	sectionHeader: {
		paddingTop: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: 30,
		fontWeight: 'bold',
		color: "black",
		// backgroundColor: '#ebedf0',
		marginBottom: 10,
	},

	// containerContent: { flex: 1, marginTop: 250 },

	// containerHeader: {
	// 	flex: 1,
	// 	alignContent: 'center',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// 	height: 5,
	// 	width: 90,
	// 	backgroundColor: 'white',
	// 	marginTop: "55%",
	// 	borderRadius: 50
	// },

	// headerContent: {
	// 	marginTop: "2%",
	// 	alignContent: 'center',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// },

	Modal: {
		backgroundColor: 'transparent',
		marginTop: 100,
	},

});
export default Services2;