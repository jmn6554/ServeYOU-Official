import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Dimensions, AppState } from "react-native";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import { NavigationContainer, useNavigation, useIsFocused } from "@react-navigation/native";
// import * as storage from "firebase/storage"
import "firebase/compat/storage";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { getFunctions, httpsCallable } from 'firebase/functions';
import LottieView from 'lottie-react-native';
import ModalButtons from '../Components/CustomButtons/ModalButtons'

const OrderQuotesReceiver = () => {
	const navigation = useNavigation();
	const [orderList, setOrderList] = useState("");
	const [userDocReference, setUserDocReference] = useState("");
	const isFocused = useIsFocused();
	const screenHeight = Dimensions.get("screen").height;
	const screenWidth = Dimensions.get("screen").width;

	useEffect(() => {
		fetchOrders();
		fetchUserDoc();
	}, [])

	useEffect(() => {
		if (isFocused) {
			ref.current?.play();
		}

		AppState.addEventListener("change", appState => {
			if (appState === "active") {
				ref.current?.play();
				console.log(2)
			}
		});
	}, [isFocused, ref.current]);

	const fetchOrders = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Orders')
				.where("user", "==", auth.currentUser.uid)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						list.push({
							user: doc.data().user,
							subTotal: doc.data().priceSum,
							companyName: doc.data().companyName,
							serviceName: doc.data().serviceName,
							productID: doc.data().productID,
							priceIDArray: doc.data().priceIDArray,
							quoteID: doc.data().quoteID,
							quoted: doc.data().quoted,
							quantity: doc.data().quantity,
							cartOptions: doc.data().cartOptions,
							selectedTime: doc.data().selectedTime,
							selectedDay: doc.data().selectedDay,
							providerID: doc.data().userID,
							quotable: doc.data().quotable,
							quoteFinalized: doc.data().quoteFinalized,
						});
					});
				});
			setOrderList(list);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchUserDoc = async () => {
		try {
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Orders')
				.where('userID', '==', user)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						setUserDocReference(doc.id)
					});
				});

		} catch (e) {
			console.log(e);
		}
	};

	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: screenHeight * 0.1, width: screenWidth, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: screenHeight * 0.04, fontWeight: "bold" }}>Orders</Text>
			</View>

			{orderList[0] == null ? <LottieView source={require("../../assets/lf30_editor_spo1ak28.json")} autoPlay loop ref={ref} /> : null}
			<View style={{ position: "absolute", top: screenHeight * 0.70 }}>
				{orderList[0] == null ? <ModalButtons style={{ fontSize: 25, marginTop: "140%", fontWeight: "400" }} text="Click here to continue shopping" onPress={() => navigation.navigate("My Services")}></ModalButtons> : null}
			</View>


			<SafeAreaView style={styles.container2}>

				<FlatList
					data={orderList}
					keyExtractor={(item) => item.id}
					extraData={orderList}
					ListFooterComponent={<View style={{ height: screenHeight * 0.17 }} />}
					renderItem={({ item, separators }) => (
						<SafeAreaView >
							<SafeAreaView >

								<View style={styles.serviceHolder}>
									<Text style={{ color: "black", fontSize: 18, fontWeight: "bold", position: "absolute", top: screenHeight * 0.015 }}>{item.serviceName.current.name} • ${item.serviceName.current.price}</Text>
									<Text style={{ color: "black", fontSize: 16, fontWeight: "bold", marginStart: 10, position: "absolute", top: screenHeight * 0.05 }}> Options/Packages </Text>

									<SafeAreaView style={{ flexDirection: "column", flexWrap: "wrap" }}>
										{item.cartOptions.map(e => {
											return (<Text style={{ fontSize: 15, marginStart: 14 }}>{e.name} • ${e.price}</Text>)
										})}
									</SafeAreaView>
									<Text style={{ color: "black", fontSize: 15, position: "absolute", bottom: screenHeight * 0.005, left: screenWidth * 0.4 }}> Date: {item.selectedDay} at {Math.trunc(item.selectedTime)}:{((item.selectedTime % 1) * 60)} {Math.trunc(item.selectedTime) > 10 ? "PM" : "AM"}</Text>

									{item.quotable == "quotable" && item.quoted == undefined ?
										<View style={styles.quote}>
											<Text style={{ fontSize: 15, color: "white" }}>Pending Quote</Text>
										</View> : null}

									{item.quotable == "quotable" && item.quoted == "true" && item.quoteFinalized == "false" ?
										<TouchableOpacity style={styles.quoteReady} onPress={() => navigation.navigate("QuoteView", { quoteID: item.quoteID, companyName: item.companyName, serviceName: item.serviceName, priceIDArray: item.priceIDArray, quantity: item.quantity })}>
											<Text style={{ fontSize: 15, color: "white" }}>Quote Draft</Text>
										</TouchableOpacity> : null}

									{item.quotable == "quotable" && item.quoteFinalized == "true" ?
										<TouchableOpacity style={styles.quoteReady} onPress={() => navigation.navigate("QuoteView", { quoteID: item.quoteID, companyName: item.companyName, serviceName: item.serviceName, priceIDArray: item.PriceIDArray, quantity: item.quantity })}>
											<Text style={{ fontSize: 15, color: "white" }}>Quote Finalized</Text>
										</TouchableOpacity> : null}

								</View>
							</SafeAreaView>

							<View>

							</View>
						</SafeAreaView>


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
		marginTop: Dimensions.get("screen").height * 0.12,
		position: "relative",
		top: "3%"

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
		marginTop: "25%",
		margin: 0,
		borderRadius: 0,
		backgroundColor: "white",
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
		borderRadius: 0,
		backgroundColor: "white",
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
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height * 0.2,
		marginBottom: 3,
		backgroundColor: "#ffffff",
		alignContent: "flex-start",
		justifyContent: "center",
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
		bottom: 40,
		right: 5,

	},

	quote: {
		width: Dimensions.get("screen").width * 0.3,
		height: Dimensions.get("screen").height * 0.05,
		// alignContent: "center",
		// alignItems: "center",
		// marginBottom: 10,
		position: "absolute",
		top: Dimensions.get("screen").height * 0.02,
		right: 20,
		backgroundColor: "'rgba(0, 0, 0, 0.7)'",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center"
	},

	quoteReady: {
		width: Dimensions.get("screen").width * 0.3,
		height: Dimensions.get("screen").height * 0.05,
		// alignContent: "center",
		// alignItems: "center",
		// marginBottom: 10,
		position: "absolute",
		top: Dimensions.get("screen").height * 0.02,
		right: 20,
		backgroundColor: "#147d14",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center"
	},

	text: {
		marginTop: 650,
	},

	picker: {
		marginTop: 40,
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
		marginTop: 10,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	Modal: {
		backgroundColor: 'transparent',
		marginTop: 115,
	},
	containerContent2: { flex: 1, marginTop: 70 },
	containerHeader2: {
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
	headerContent2: {
		marginTop: 10,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	Modal2: {
		backgroundColor: 'transparent',
		marginTop: 115,
	}




});
export default OrderQuotesReceiver;