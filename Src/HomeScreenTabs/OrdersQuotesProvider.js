import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView, TouchableOpacity, Pressable, Keyboard, Dimensions, TextInput } from "react-native";
import { SpeedDial, Overlay } from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';
import CustomInput from "../Components/CustomInput";
import CustomButton from "../Components/CustomButtons/CustomButton";
import ModalButtons from "../Components/CustomButtons/ModalButtons";
import ModalButton2 from "../Components/CustomButtons/ModalButton2"
import ElipseButton from "../Components/CustomButtons/ElipseButton"
import PlusButton from "../Components/CustomButtons/PlusButton"
import DeleteButton from "../Components/CustomButtons/DeleteButton"
import EditButton from "../Components/CustomButtons/EditButton"
import NumberInput from "../Components/CustomInput/NumberInput"
import DropDownPicker from "react-native-dropdown-picker";
import Swipeout from 'react-native-swipeout';
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
import NumberInputArray from "../Components/CustomInput/NumberInputArray"
import { set } from "react-native-reanimated";

const OrdersQuotesProvider = () => {
	const [quantity, setQuantity] = useState();
	const [orderList, setOrderList] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	const navigation = useNavigation();
	const [reload, setReload] = useState(0);
	const [customerID, setCustomerID] = useState("");
	const [priceID, setPriceID] = useState("");
	const [docID, setDocID] = useState("");
	const [userID, setUserID] = useState("");
	const [count, setCount] = useState("");
	const [index, setIndex] = useState();
	const [quantityInput, setQuantityInput] = useState("");
	const [priceIDArray, setPriceIDArray] = useState("");
	var tempCount = 0;

	useEffect(async () => {
		setIndex(0);
		await fetchOrders();
	}, [])

	const fetchOrders = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Orders')
				.where('providerID', '==', user)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						list.push({
							docID: doc.id,
							user: doc.data().user,
							subTotal: doc.data().priceSum,
							companyName: doc.data().companyName,
							serviceName: doc.data().serviceName,
							customerID: doc.data().customerID,
							productID: doc.data().productID,
							priceID: doc.data().priceID,
							cartOptions: doc.data().cartOptions,
							selectedTime: doc.data().selectedTime,
							selectedDay: doc.data().selectedDay,
							providerID: doc.data().userID,
							quotable: doc.data().quotable,
							quoted: doc.data().quoted,
							quoteID: doc.data().quoteID,
							quoteFinalized: doc.data().quoteFinalized,
						});
						// console.log(doc.data().customerID)
					});
				});
			tempCount += 1;
			setCount(tempCount)
			setOrderList(list);

			let tempList = [];
			// let tempPriceIDCount = 0;

			orderList.forEach(e => {
				// if (tempPriceIDCount == 0){
				e.priceID.forEach(subElement => tempList.push({ priceID: subElement, quantity: "" }))
				// }
				// tempPriceIDCount += 1;
			})
			setPriceIDArray(tempList)

		} catch (e) {
			console.log(e);
		}

	};

	const quoteCustomer = async (quantity) => {
		const functions = getFunctions()
		const data = { quantity: quantity, customerID: customerID, priceID: priceID }
		const response = await httpsCallable(functions, 'quoteCreation')(data).then(function (result) {
			const quote = result.data.quote;
			const db = firebase.firestore();
			db
				.collection('Orders')
				.doc(docID)
				.update({ quoteID: result.data.quote.id, quoted: "true", quoteFinalized: "false", quantity: quantity })

			db
				.collection('Users')
				.where('userID', '==', userID)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						updateUserQuoteField(doc.id)
					});
				});

			return {
				quote: quote
			};
		}).catch(console.log)

		const updateUserQuoteField = async (quotedUserDocReference) => {
			const db = firebase.firestore();
			await db
				.collection('Users')
				.doc(quotedUserDocReference)
				.update({ newQuote: "true" })
		}
		return response

	};

	const quoteFinalized = async (quoteID, docID, userID) => {
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'quoteFinalized')(quoteID).then(function (result) {
			const quote = result.data.quote;
			const db = firebase.firestore();
			db
				.collection('Orders')
				.doc(docID)
				.update({ quoteFinalized: "true" })

			db
				.collection('Users')
				.where('userID', '==', userID)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						updateUserQuoteField(doc.id)
					});
				});

			return {
				quote: quote
			};
		}).catch(console.log)

		const updateUserQuoteField = async (quotedUserDocReference) => {
			const db = firebase.firestore();
			await db
				.collection('Users')
				.doc(quotedUserDocReference)
				.update({ newQuote: "true" })
		}
		return response

	};

	const inputHandler = (priceID, text) => {
		// priceIDArray[priceIDArray.findIndex(e => e.priceID == quantityInput)].quantity = text;
		priceIDArray[priceIDArray.findIndex(e => e.priceID == quantityInput)].quantity = text;
		console.log(priceIDArray[priceIDArray.findIndex(e => e.priceID == quantityInput)].quantity);
	}

	console.log(priceIDArray)

	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Orders</Text>
			</View>

			<SafeAreaView style={styles.container2}>

				<FlatList
					data={orderList}
					keyExtractor={(item) => item.id}
					extraData={orderList}
					ListFooterComponent={<View style={{ height: 90 }} />}
					renderItem={({ item, index }) => (
						<SafeAreaView >
							<SafeAreaView >

								<View style={styles.serviceHolder}>
									<Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>{item.serviceName.current.name} • ${item.serviceName.current.price}</Text>

									<Text style={{ color: "black", fontSize: 16, fontWeight: "bold", marginStart: 10 }}> Options/Packages </Text>

									<SafeAreaView style={{ flexDirection: "column", flexWrap: "wrap" }}>
										{item.cartOptions.map(e => {
											return (<Text style={{ fontSize: 15, marginStart: 14 }}>{e.name}  ${e.price}</Text>)
										})}
									</SafeAreaView>

									<Text style={{ color: "black", fontSize: 15, marginLeft: "42%", marginTop: "3%" }}> Date: {item.selectedDay} at {Math.trunc(item.selectedTime)}:{((item.selectedTime % 1) * 60)}{item.selectedTime % 1 == 0 ? "0" : null} {Math.trunc(item.selectedTime) > 10 ? "PM" : "AM"}</Text>

									{item.quotable == "quotable" && item.quoteID == undefined ?
										<TouchableOpacity style={styles.quote} onPress={() => { setModalVisible(true), console.log(item.docID), setCustomerID(item.customerID), setPriceID(item.priceID), setDocID(item.docID), setUserID(item.user), fetchOrders(), setIndex(index), console.log(index) }}>
											<Text style={{ fontSize: 15, color: "white" }}>Create Quote</Text>
										</TouchableOpacity> : null}

									{item.quotable == "quotable" && item.quoted == "true" ?
										<TouchableOpacity style={styles.quoteFinalized} onPress={() => { quoteFinalized(item.quoteID, item.docID, item.user), fetchOrders() }}>
											<Text style={{ fontSize: 15, color: "white" }}>Finalize Quote</Text>
										</TouchableOpacity> : null}

									{item.quotable == "quotable" && item.quoteFinalized == "true" ?
										<View style={styles.quotePending}>
											<Text style={{ fontSize: 15, color: "white" }}>Pending</Text>
										</View> : null}

								</View>

								<SafeAreaView >

									<SwipeUpDownModal
										modalVisible={modalVisible}
										PressToanimate={animateModal}
										//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
										ContentModal={
											<Pressable onPress={() => Keyboard.dismiss()}>
												<View style={styles.modalView}>
													<View style={styles.container3}>
														<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 40, }}>Quote Customer</Text>

														<KeyboardAvoidingView behavior="height" style={{ flex: 1 }} >

															<View style={{ flexDirection: "column", flexWrap: "wrap" }}>
																{item.priceID.map((e, index) => {
																	return (
																		<View style={styles.inputContainer}>
																			{item.serviceName.current.name != null ?
																				<Text>{item.serviceName.current.name}</Text> : <Text>hey</Text>
																			}
																			<TextInput
																				placeholderTextColor="black"
																				value={priceIDArray[priceIDArray.indexOf(e)]}
																				onChangeText={(text) => { inputHandler(e, text) }}
																				onPressIn={() => { setQuantityInput(e) }}
																				placeholder="Quantity"
																				style={styles.input}
																				secureTextEntry={false}
																				keyboardType="numeric"
																			/>
																		</View>)
																})}
															</View>

															<ModalButtons
																text="Send Quote"
																onPress={() => { setModalVisible(false), quoteCustomer(quantity) }}
															/>
															<ModalButtons
																text="Cancel"
																onPress={() => setModalVisible(false)}
															/>
														</KeyboardAvoidingView>

													</View>
												</View>
											</Pressable>
										}
										HeaderStyle={styles.headerContent}
										ContentModalStyle={styles.Modal}
										HeaderContent={
											<View style={styles.containerHeader}>

											</View>
										}
										onClose={() => {
											setModalVisible(false);
											setanimateModal(false);
										}}
									/>

								</SafeAreaView>
							</SafeAreaView>

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

	quoteFinalized: {
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
	quotePending: {
		width: Dimensions.get("screen").width * 0.3,
		height: Dimensions.get("screen").height * 0.05,
		// alignContent: "center",
		// alignItems: "center",
		// marginBottom: 10,
		position: "absolute",
		top: Dimensions.get("screen").height * 0.02,
		right: 20,
		backgroundColor: "#a1850b",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center"
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
	},

	inputContainer: {
		backgroundColor: "white",
		width: Dimensions.get("screen").width * 0.45,
		height: Dimensions.get("screen").height * 0.06,
		borderColor: "black",
		borderRadius: 10,
		borderWidth: 0.35,
		paddingHorizontal: 10,
		marginTop: 5,
		marginBottom: 5,
		justifyContent: "center",
	},
	input: { borderColor: "#2c4391", },




});
export default OrdersQuotesProvider;