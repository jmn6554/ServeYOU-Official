import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView, TouchableOpacity, Pressable, Keyboard, Dimensions } from "react-native";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import GetLocation from 'react-native-get-location'
import * as ImagePicker from 'expo-image-picker'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { ScrollView } from "react-native-gesture-handler";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import * as storage from "firebase/storage"
import "firebase/compat/storage";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { getFunctions, httpsCallable } from 'firebase/functions';
import moment from "moment";
import LottieView from 'lottie-react-native';


const QuoteView = ({ route }) => {
	const [orderList, setOrderList] = useState("");
	const [userDocReference, setUserDocReference] = useState("");
	const [quoteObject, setQuoteObject] = useState("");
	const [quoteLineItems, setQuoteLineItems] = useState("");
	const [loading, setLoading] = useState(true);
	const height = Dimensions.get("screen").height
	const width = Dimensions.get("screen").width

	useEffect(() => {
		fetchQuote();
		quoteRetrieval();
	}, [])

	const fetchQuote = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Orders')
				.where('quoteID', '==', route.params.quoteID)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {


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

	const quoteRetrieval = async () => {
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'quoteRetrieval')(route.params.quoteID).then(function (result) {
			// console.log(result.data.quote);
			const quote = result.data.quote;
			const quoteLineItems = result.data.lineItems;
			setQuoteObject(quote);
			setQuoteLineItems(quoteLineItems);
			return {
				quote: quote,
				quoteLineItems: quoteLineItems,
			};
		}).catch(console.log)
		setLoading(false)
		return response
	};
	console.log(quoteLineItems);

	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Quote</Text>
			</View>

			{loading == true ? null :
				<View>
					<View style={{ borderTopWidth: 1, position: "absolute", top: height * 0.12, width: width * 1 }}>
					</View>
					<Text style={{ color: "black", fontSize: 25, fontWeight: "bold", top: height * 0.13, }}>{route.params.companyName}</Text>
					{quoteObject.number != null ?
						<Text style={{ color: "black", fontSize: 13, position: "absolute", top: height * 0.18, right: width * 0.05, fontWeight: "bold" }}>Quote Number {quoteObject.number}</Text> : null
					}
					<Text style={{ color: "black", fontSize: 14, position: "absolute", top: height * 0.23, left: width * 0.03, fontWeight: "bold" }}>Quote For</Text>
					<Text style={{ color: "black", fontSize: 13, position: "absolute", top: height * 0.25, left: width * 0.03, fontWeight: "400" }}>{auth.currentUser.email}</Text>
					{quoteObject.status_transitions.finalized_at != null ?
						<Text style={{ color: "black", fontSize: 15, position: "absolute", top: height * 0.20, right: width * 0.05, fontWeight: "500" }}>Issued: {moment.unix(quoteObject.status_transitions.finalized_at).format("DD MMM, yyyy")}</Text> : null
					}
					<View style={{ borderTopWidth: 1, position: "absolute", top: height * 0.28, width: width * 1 }}>
					</View>
					<Text style={{ color: "black", fontSize: 21, position: "absolute", top: height * 0.3, fontWeight: "bold" }}>Description</Text>
					<Text style={{ color: "black", fontSize: 15, position: "absolute", top: height * 0.05, right: width * 0.05, fontWeight: "500" }}>Valid until: {moment.unix(quoteObject.expires_at).format("DD MMM, yyyy")}</Text>
					<Text style={{ color: "black", fontSize: 21, position: "absolute", top: height * 0.3, right: width * 0.45, fontWeight: "bold" }}>QTY</Text>
					<Text style={{ color: "black", fontSize: 21, position: "absolute", top: height * 0.3, right: width * 0.05, fontWeight: "bold" }}>Amount</Text>
					{quoteLineItems.data.map(e => { return (<Text style={{ color: "black", fontSize: 17, position: "relative", top: height * 0.32, marginBottom: 20, fontWeight: "bold", flexDirection: "column" }}>{e.description}</Text>) })}
					{quoteLineItems.data.map(e => { return (<Text style={{ color: "black", fontSize: 17, position: "relative", top: height * 0.18, left: width * 0.5, marginBottom: 20, fontWeight: "bold", flexDirection: "column" }}>{e.quantity}</Text>) })}
					{quoteLineItems.data.map(e => { return (<Text style={{ color: "black", fontSize: 17, position: "relative", top: height * 0.03, left: width * 0.75, marginBottom: 20, fontWeight: "bold", flexDirection: "column" }}>${e.price.unit_amount / 100}</Text>) })}
					<Text style={{ color: "black", fontSize: 18, position: "absolute", top: height * 0.08, right: width * 0.05, fontWeight: "bold" }}>${quoteObject.amount_total / 100}</Text>
					{/* <Text style={{ color: "black", fontSize: 22, position: "absolute", top: height * 0.35, right: width * 0.05, fontWeight: "400" }}>${quoteObject.amount_total / 100}</Text> */}
					<View style={{ borderTopWidth: 1, position: "absolute", top: height * 0.73, width: width * 1 }}>
					</View>
					<Text style={{ color: "black", fontSize: 22, position: "absolute", top: height * 0.75, right: width * 0.05, fontWeight: "400" }}>Quote Total: ${quoteObject.amount_total / 100}</Text>

				</View>
			}
			{loading == true ? <LottieView source={require("../../assets/50738-loading-line.json")} autoPlay loop ref={ref} /> : null}


		</SafeAreaView >
	); n
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignItems: "center",
		// justifyContent: "center",
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
		marginTop: 45,
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
		height: Dimensions.get("screen").height * 0.12,
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
export default QuoteView;