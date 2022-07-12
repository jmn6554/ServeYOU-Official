import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, TouchableOpacity, RefreshControl, ScrollView, Dimensions } from "react-native";
import XButton from "../Components/CustomButtons/XButton"
import EditButton from "../Components/CustomButtons/EditButton"
import userID from "./ServicesReceiver"
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import GestureRecognizer from "react-native-swipe-gestures";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
	useNavigation,
	NavigationContainer,
	DefaultTheme,
	useIsFocused
} from "@react-navigation/native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import * as Haptics from 'expo-haptics';

const Services3 = ({ route, navigation }) => {
	const isFocused = useIsFocused();
	const [address, setAddress] = useState("");
	const [serviceList, setServiceList] = useState("");
	const [combinedUsers, setCombinedUsers] = useState(auth.currentUser.uid + route.params.userID)
	const [found, setFound] = useState(false)
	const ref = React.useRef();
	var [chatID, setChatID] = useState("")
	const [name, setName] = useState("")
	const [params, setParams] = useState("")
	const [intervals, setIntervals] = useState(true)
	const [Fetch, setFetch] = useState("")
	const [refreshing, setRefreshing] = useState(false);
	const cartItems = useRef([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (isFocused) {
			ref.current?.play();
		}
	}, [isFocused, ref.current]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const list = [];
				const db = firebase.firestore();
				const user = auth.currentUser.uid;
				await db
					.collection('Services')
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const {
								name,
								description,
								price,
								priceUnit,
								image,
								address,
								serviceType,
								priceID,
								productID
							} = doc.data();
							setAddress(doc.data().address)
							if (doc.data().user == route.params.userID) {
								list.push({
									id: doc.id,
									name: name,
									description: description,
									price: price,
									priceUnit: priceUnit,
									priceID: priceID,
									productID: productID,
									image: image,
									serviceType: serviceType,
								});
							}
						});
					});
				setLoading(false);
				setServiceList(list);
			} catch (e) {
				console.log(e);
			}
		};
		fetchServices();

	}, [])

	useEffect(() => {
		getUsers();
	}, [Fetch])

	const getUsers = async () => {
		try {
			const list = [];
			const user = auth.currentUser.uid;
			const db = firebase.firestore();
			await db
				.collection('ChatRooms')
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						if (doc.data().users.includes(route.params.userID) && doc.data().users.includes(user)) {
							setFound(true)
							list.push({
								docID: doc.id,
								chatID: doc.data().chatID
							})
							console.log("hey")
						}
						else {

						}

					});
				});
			setParams(list)

		} catch (e) {
			console.log(e);
		}
	};

	console.log("company name: " + route.params.companyName)


	const toAdd = () => {
		if (found == false) {
			addChatID();
			getUsers();
			navigation.navigate("Chats", { userID: route.params.userID, name: route.params.companyName, currName: name, chatID: params[0].chatID, docID: params[0].docID })
		}
		else if (params[0].docID && params[0].chatID) {
			navigation.navigate("Chats", { userID: route.params.userID, name: route.params.companyName, currName: name, chatID: params[0].chatID, docID: params[0].docID })
		}
	}

	const addChatID = () => {
		const db = firebase.firestore();
		const rand = uuid.v1();
		const user = auth.currentUser.uid;
		setChatID(rand)
		db.collection("ChatRooms").add({
			// chatIDs: { chatRoom: rand, name: "hey" },
			chatID: rand,
			users: combinedUsers,
			user1: { name: route.params.companyName, userID: route.params.userID },
			user2: { name: route.params.currName, userID: user },
			usersArray: [route.params.userID, user],
			latestMessage: "",
		})
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		if (address != null) {
			fetchServices();
		}
		else {
			setIntervals(false)
		}

		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);

	const nextDays = [
		'2022-03-01',
		'2022-03-05',
		'2022-03-08',
		'2022-03-07',
		'2022-03-18',
		'2022-03-17',
		'2022-03-28',
		'2022-03-29'
	];

	let mark = {};

	nextDays.forEach(day => {
		mark[day] = { disabled: true, disableTouchEvent: true };
	});

	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>

				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>{route.params.companyName}</Text>
				<TouchableOpacity style={{ position: "absolute", top: 40, right: 20 }} onPress={() => { toAdd() }}>
					<Ionicons
						name="chatbubble-ellipses"
						type="ionicon"
						color="black"
						size="25"
					/>
				</TouchableOpacity>
			</View>

			{/* {loading == true ? <LottieView style={{zIndex:999}} source={require("../../assets/50738-loading-line.json")} autoPlay loop ref={ref} /> : null} */}

			<SafeAreaView style={styles.container2}>

				<FlatList
					refreshControl={<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="black"
						colors={['transparent']}
						style={{ backgroundColor: "transparent" }}
					/>}
					data={serviceList}
					keyExtractor={(item) => item.id}
					extraData={serviceList}
					ListFooterComponent={<View style={{ height: 20 }} />}
					renderItem={({ item, separators }) => (
						<TouchableOpacity onPress={() => { cartItems.current = { name: item.name, price: item.price}, navigation.navigate("Options", { userID: route.params.userID, cartItems: cartItems, companyName: route.params.companyName, serviceName: item.name, quotable: item.serviceType, priceID: item.priceID, productID: item.productID, priceUnit: item.priceUnit }) }}>
							<SafeAreaView >

								<View style={styles.serviceHolder}>

									{/* <View> */}
									<Image style={styles.tinyLogo}
										source={{
											uri: item.image,
										}} />
									{/* </View> */}

									<Text style={{ color: "black", fontWeight: "bold", marginTop: "40%", flexDirection: "row" }} >
										<Text style={{ color: "black", fontSize: 25 }}> {item.name} </Text> <Text style={{ fontSize: 18, marginLeft: 5 }}>{item.price} {item.priceUnit}</Text>

									</Text>
									<Text style={{ color: "black", fontWeight:"400", marginTop: "2%", fontSize: 18 }}> {item.description}</Text>
									
									{item.serviceType == "quotable" ?
									<View style={styles.quote}>
										<Text style={{ fontSize: 15, color: "white" }}>Requires Quote</Text>
									</View>
									: null
									}

								</View>


							</SafeAreaView>
						</TouchableOpacity>

					)}
				/>


			</SafeAreaView>


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
		elevation: 5,
		borderRadius: 35
	},

	serviceHolder: {
		width: Dimensions.get("window").width * 0.95,
		height: Dimensions.get("window").height * 0.3,
		marginBottom: 5,
		backgroundColor: "#ebedf0",
		alignContent: "flex-start",
		borderRadius: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.30,
		shadowRadius: 2,

		elevation: 8,
		borderRadius: 20,
	},

	tinyLogo: {
		width: Dimensions.get("window").width * 0.95,
		height: Dimensions.get("window").height * 0.17,
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
	containerContent: { flex: 1, marginTop: 70 },
	containerHeader: {
		flex: 1,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		height: 5,
		width: 90,
		backgroundColor: 'white',
		marginTop: 185,
		borderRadius: 50
	},
	headerContent: {
		marginTop: 0,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	Modal: {
		backgroundColor: 'white',
		marginTop: 200,
	},

	quote: {
		width: Dimensions.get("screen").width * 0.32,
		height: Dimensions.get("screen").height * 0.05,
		position: "absolute",
		top: Dimensions.get("screen").height * 0.22,
		right: 20,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center"
	},


});
export default Services3;