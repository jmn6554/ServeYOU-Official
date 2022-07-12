import React, { useState, useEffect, useRef, useLayoutEffect, ReactDOM } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, AppState, TouchableOpacity, Pressable, Keyboard, Dimensions } from "react-native";
import DownPicker from "../Components/CustomButtons/DownPicker";
import CustomButton from "../Components/CustomButtons/CustomButton"
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import { useNavigation, NavigationContainer, useIsFocused } from "@react-navigation/native";
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { CardField, useStripe, StripeProvider, createToken, stripe, useConfirmPayment } from '@stripe/stripe-react-native';
import "firebase/functions";
import { getFunctions, httpsCallable } from 'firebase/functions';
import LottieView from 'lottie-react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import HomeScreenReceiver from '../Home/HomeScreenReceiver';
import ModalButtons from '../Components/CustomButtons/ModalButtons'


const Cart = () => {
	const { createToken, initPaymentSheet, presentPaymentSheet } = useStripe();
	const [address, setAddress] = useState("");
	const [serviceList, setServiceList] = useState("");
	const navigation = useNavigation();
	const [stripeKey, setStripeKey] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState(true)
	const [cartSubTotal, setCartSubTotal] = useState("");
	const ref = React.useRef();
	const [customerID, setCustomerID] = useState("");
	const [ephemeralKey, setEphemeralKey] = useState("");

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

	useEffect(async () => {
		if (isFocused) {
			await fetchCart();
			await fetchStripeKey();
			await fetchCartPrice();
		}
		else {
			setLoading(true);
		}
	}, [global.cartCount]);

	useEffect(async () => {
		setLoading(true)
		await fetchCart();
		await fetchStripeKey();
		await fetchCartPrice();
		setLoading(false);
	}, [global.cartCount]);

	const fetchStripeKey = async () => {
		try {
			var key = ""
			const user = auth.currentUser.uid;
			const db = firebase.firestore();
			await db
				.collection('Keys')
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						key = doc.data().publishableKey
					});
				});
			setStripeKey(key)

		} catch (e) {
			console.log(e);
		}
	};


	const fetchCart = async () => {
		try {
			var cartCounter = 0;
			const list = [];
			const db = firebase.firestore();
			await db
				.collection('Cart')
				.where('userID', "==", auth.currentUser.uid)
				.orderBy("companyName")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						const {
							user,
							companyName,
							serviceName,
							cartOptions,
							selectedTime,
							selectedDay,
							subTotal,
							providerID
						} = doc.data();
						cartCounter += 1;
						list.push({
							id: doc.id,
							user: user,
							providerID: providerID,
							companyName: companyName,
							serviceName: serviceName,
							cartOptions: cartOptions,
							selectedTime: selectedTime,
							selectedDay: selectedDay,
							subTotal: subTotal

						});
					});
				});
			// setCartItemCount(cartCounter);
			setServiceList(list);
		} catch (e) {
			console.log(e);
		}

	};

	const cartClear = async () => {
		var cartCounter = 0;
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Cart')
				.orderBy("companyName")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						if (doc.data().user == user) {
							db.collection("Cart").doc(doc.id).delete()
						}
					});
				});
		} catch (e) {
			console.log(e);
		}
		setServiceList([])
		global.cartItemCounter = 0;
		global.cartCount += 1;
	};

	const orderAdd = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;

			// serviceList.forEach(e => console.log(e))
			serviceList.forEach(e =>
				db
					.collection('Orders')
					.add(e))

			// await db
			// 	.collection('Orders')
			// 	.add({ serviceList })
			// console.log("working");
		} catch (e) {
			console.log(e);
		}
		setServiceList([])
	};

	const fetchCartPrice = async () => {
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'cartPriceFetch')(auth.currentUser.uid).then(function (result) {
			var sum = 0
			var existingStripeCustomerFound = 0;
			result.data.forEach(e => {
				sum = e + sum
			});
			const db = firebase.firestore();
			db
				.collection('Users')
				.get()
				.then((querySnapshot) => {

					querySnapshot.forEach((doc) => {
						if (doc.data().userID == auth.currentUser.uid && doc.data().customerID != undefined) {
							const user = doc.data().userID;
							const data = { price: sum, user: user };
							initializePaymentSheetReturningCustomer(data);
							existingStripeCustomerFound += 1;
							return;
						}
					});
					if (existingStripeCustomerFound != 1) {
						initializePaymentSheet(sum);
					}
				});
			// console.log("customer: " + existingStripeCustomerFound)

			setCartSubTotal(sum);
			return {
				result
			};

		}).catch(console.log)
		return response;

	};

	const deleteCartItem = async (id) => {
		await firebase.firestore().collection("Cart").doc(id).delete();
		await fetchCart();
		await fetchStripeKey();
		await fetchCartPrice();
	};

	const fetchPaymentSheetParams = async (sum) => {
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'paymentSheet')(sum).then(function (result) {
			const paymentIntent = result.data.clientSecret;
			const ephemeralKey = result.data.ephemeralKey;
			const customer = result.data.customer;
			const paymentMethods = result.data.paymentMethods;
			const publishableKey = result.data.publishableKey;
			const db = firebase.firestore();

			db
				.collection('Users')
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						if (doc.data().userID == auth.currentUser.uid && doc.data().customerID == undefined && doc.data().paymentMethods == undefined) {
							db.collection("Users").doc(doc.id).update({ customerID: result.data.customer, paymentMethodID: result.data.paymentMethods })
						}
					});
				});

			return {
				paymentIntent: paymentIntent,
				ephemeralKey: ephemeralKey,
				customer: customer,
				paymentMethods: paymentMethods,
				publishableKey: "pk_test_51KzOvYCZFYQ4UjzxqG53MvL2ZBlkpykcGlvkbPt2PJvWBvvl8zfm8up8wMVJgFv2JipKWFDXKbrbnMFvKXR5dXRt00cXlIxVjT",
			};
		}).catch(console.log)

		return response
	};

	const fetchPaymentSheetParamsReturningCustomer = async (data) => {
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'paymentSheetReturningCustomer')(data).then(function (result) {
			const paymentIntent = result.data.clientSecret;
			// const ephemeralKey = result.data.ephemeralKey;
			const customer = result.data.customer;
			const publishableKey = result.data.publishableKey;
			return {
				paymentIntent: paymentIntent,
				// ephemeralKey: ephemeralKey,
				customer: customer,
				publishableKey: "pk_test_51KzOvYCZFYQ4UjzxqG53MvL2ZBlkpykcGlvkbPt2PJvWBvvl8zfm8up8wMVJgFv2JipKWFDXKbrbnMFvKXR5dXRt00cXlIxVjT",
			};
		}).catch(console.log)
		return response
	};

	const initializePaymentSheet = async (sum) => {
		const {
			paymentIntent,
			ephemeralKey,
			customer,
			publishableKey,
		} = await fetchPaymentSheetParams(sum).catch(setLoading(false));

		const { error } = await initPaymentSheet({
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			// Set `allowsDelayedPaymentMethods` to true if your business can handle payment
			//methods that complete payment after a delay, like SEPA Debit and Sofort.
			allowsDelayedPaymentMethods: true,
		});

		if (!error) {
			setLoading(true);
		}
		setLoading(false);
	};

	const initializePaymentSheetReturningCustomer = async (data) => {
		const {
			paymentIntent,
			ephemeralKey,
			customer,
			publishableKey,
		} = await fetchPaymentSheetParamsReturningCustomer(data).catch(setLoading(false));

		const { error } = await initPaymentSheet({
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			// Set `allowsDelayedPaymentMethods` to true if your business can handle payment
			//methods that complete payment after a delay, like SEPA Debit and Sofort.
			allowsDelayedPaymentMethods: true,
		});

		if (!error) {
			setLoading(true);
		}
		setLoading(false);
	};

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet();

		if (error) {
			// Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			await orderAdd();
			Alert.alert('Success', 'Your order is confirmed!');
			cartClear();
		}
	};

	return (
		<StripeProvider
			publishableKey={stripeKey}
			merchantIdentifier="merchant.identifier"
		>
			<SafeAreaView style={styles.container} >


				<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
					<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Cart</Text>
				</View>

				{loading == true ? <LottieView source={require("../../assets/50738-loading-line.json")} autoPlay loop ref={ref} /> : null}

				{serviceList[0] == null && loading == false ? <LottieView source={require("../../assets/lf30_editor_spo1ak28.json")} autoPlay loop ref={ref} /> : null}

				{serviceList[0] != null && loading == false ? <SafeAreaView style={styles.container2}>
					<SafeAreaView>

						<SwipeListView
							useFlatList
							data={serviceList}
							keyExtractor={(item) => item.id}
							extraData={serviceList}
							ListFooterComponent={<View style={{ height: 90 }} />}
							renderItem={({ item, rowMap }) => (
								<SafeAreaView >

									<View style={styles.serviceHolder}>
										<Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}> {item.companyName} • {item.serviceName.current.name} • ${item.serviceName.current.price}</Text>
										<Text style={{ color: "black", fontSize: 16, fontWeight: "bold", marginStart: 10 }}> Options/Packages </Text>

										<SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap" }}>
											{item.cartOptions.map(e => {
												return (<Text style={{ fontSize: 15, marginStart: 14 }}>{e.name} • ${e.price}</Text>)
											})}
										</SafeAreaView>
										<Text style={{ color: "black", fontSize: 15, marginLeft: "42%", marginTop: "3%" }}> Date: {item.selectedDay} at {Math.trunc(item.selectedTime)}:{((item.selectedTime % 1) * 60)} {Math.trunc(item.selectedTime) > 10 ? "PM" : "AM"}</Text>

									</View>
								</SafeAreaView>
							)}
							renderHiddenItem={(item, rowMap) => (
								<TouchableOpacity onPress={() => { fetchCartPrice(), deleteCartItem(item.item.id), rowMap[item.item.id].closeRow() }}>
									<View style={{ backgroundColor: "red", height: "98.5%", width: 100, borderRadius: 0, justifyContent: "center", alignItems: "center", marginLeft: 295 }}>
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
					</SafeAreaView>


				</SafeAreaView> : null}

				{serviceList[0] != null && loading == false ? <View style={{ flex: 0, height: "100%", width: "100%", backgroundColor: "white", alignItems: "center", position: "absolute", top: "80%", borderTopWidth: 0.3 }}>
					<View style={{ position: "absolute", top: "3%", left: "3%", borderBottomWidth: 2, width: "30%", height: "100%" }}>
						{serviceList[0] != null ? <Text style={{ fontSize: 22, fontWeight: "bold" }}>Subtotal</Text> : null}
					</View>

					<View style={{ position: "absolute", top: "3%", right: "0%", borderBottomWidth: 2, width: "30%", height: "100%" }}>
						{serviceList[0] != null ? <Text style={{ fontSize: 22, fontWeight: "bold" }}>${cartSubTotal}</Text> : null}
					</View>

					<View style={{ position: "absolute", top: "11%" }}>
						{serviceList[0] != null ? <CustomButton text="Checkout" onPress={() => openPaymentSheet()} /> : null}
					</View>

					{/* <View style={{ position: "absolute", top: "11%" }}>
					<CustomButton text="Test" onPress={() => openPaymentSheet()} />
					</View> */}

				</View> : null}

				<SafeAreaView >

					<SwipeUpDownModal
						modalVisible={modalVisible}
						PressToanimate={animateModal}
						//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
						ContentModal={
							<Pressable onPress={() => Keyboard.dismiss()}>
								<SafeAreaView style={styles.modalView}>
									<View style={styles.container3}>
										<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 60, }}>Checkout</Text>
									</View>

									<CardField
										postalCodeEnabled={false}
										placeholder={{
											number: '4242 4242 4242 4242',
										}}
										cardStyle={{
											backgroundColor: '#FFFFFF',
											textColor: '#000000',
											borderWidth: 1,
										}}
										style={{
											width: '99%',
											height: "6%",
											marginVertical: "20%",
										}}
										onCardChange={(cardDetails) => {
											console.log('cardDetails', cardDetails);
										}}
										onFocus={(focusedField) => {
											console.log('focusField', focusedField);
										}}
									/>

								</SafeAreaView>
								<View style={{ alignSelf: "center", position: "absolute", bottom: "15%" }}>
									<CustomButton text="Pay" onPress={() => handlePayPress()} />
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

				<View style={{ position: "absolute", top: Dimensions.get("screen").height * 0.70 }}>
					{serviceList[0] == null && loading == false ? <ModalButtons style={{ fontSize: 25, marginTop: "140%", fontWeight: "400" }} text="Click here to continue shopping" onPress={() => navigation.navigate("My Services")}></ModalButtons> : null}
				</View>


			</SafeAreaView>
		</StripeProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
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
		alignItems: "center",
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
		width: 395,
		height: 100,
		marginBottom: 3,
		backgroundColor: "#ffffff",
		alignContent: "flex-start",
		borderWidth: 0.25,
		flexWrap: "wrap"
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
		fontSize: 24
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
		marginTop: "35%",
		borderRadius: 50
	},
	headerContent: {
		marginTop: 0,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	// Modal: {
	//     backgroundColor: 'white',
	//     marginTop: "50%",
	// }


});
export default Cart;