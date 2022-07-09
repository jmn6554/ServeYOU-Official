import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView, TouchableOpacity, Pressable, Keyboard, Dimensions, TouchableHighlight } from "react-native";
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
import RNPickerSelect from 'react-native-picker-select';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { BlurView } from 'expo-blur';


const Services2 = () => {
	const screenHeight = Dimensions.get("screen").height;
	const screenWidth = Dimensions.get("screen").width;
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [serviceList, setServiceList] = useState("");
	const [userAddress, setUserAddress] = useState("");
	const [Fetch, setFetch] = useState("");
	const [image, setImage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible1, setModalVisible1] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [modalVisible3, setModalVisible3] = useState(false);
	const [animateModal, setanimateModal] = useState(false);
	const navigation = useNavigation();
	const [pricePickerValue, setPricePickerValue] = useState("");
	const [reload, setReload] = useState(0);
	const [priceMeasurementUnits, setpriceMeasurementUnits] = useState("")
	const priceMeasurementUnitsArray = [1, 2, 3];


	const addService = async (productID, priceID, serviceType) => {
		const db = firebase.firestore();
		const user = auth.currentUser.uid;

		// console.log(image)

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
			const ref1 = ref(getStorage(), "serviceBanners/" + user + name);
			const result = await uploadBytesResumable(ref1, blob);
			const imageURL = await getDownloadURL(ref1);

			blob.close();

			db.collection("Services").add({
				name: name,
				description: description,
				price: price,
				priceUnit: pricePickerValue,
				priceID: priceID,
				productID: productID,
				serviceType: serviceType,
				address: userAddress,
				user: user,
				image: imageURL,
				created: firebase.firestore.Timestamp.now(),
			}).then(() => { console.log("Service Added") })
		}
		else {
			db.collection("Services").add({
				name: name,
				description: description,
				price: price,
				priceUnit: pricePickerValue,
				priceID: priceID,
				productID: productID,
				serviceType: serviceType,
				address: userAddress,
				user: user,
				// image: imageURL,
				created: firebase.firestore.Timestamp.now(),
			}).then(() => { console.log("Service Added") })
		};

		fetchServices();

	}

	const editModalOpen = async (id) => {
		setModalVisible2(true)
	}

	const deleteService = async (id, name) => {

		const db = firebase.firestore();
		await db
			.collection('Services')
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					if (doc.id == id) {
						db.collection("Services").doc(id).delete();
					}
				});
				// fetchServices();
				setName("");
				setDescription("");
				setPrice("");
			});

		const ref1 = ref(getStorage(), "serviceBanners/" + auth.currentUser.uid + name);
		await deleteObject(ref1).then(console.log("deleted"));

		fetchServices();
	}

	const editService = async (id) => {

		const db = firebase.firestore();
		const user = auth.currentUser.uid;

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
		const ref1 = ref(getStorage(), 'serviceBanners/' + user + name);
		const result = await uploadBytesResumable(ref1, blob);
		const imageURL = await getDownloadURL(ref1);

		blob.close();

		await db
			.collection('Services')
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					if (doc.id == id) {
						db.collection("Services").doc(id).set({
							user: user,
							name: name,
							description: description,
							price: price,
							address: userAddress,
							image: imageURL,
							created: firebase.firestore.Timestamp.now(),
						})
					}
				});
				setModalVisible2(false);
				setFetch(true);
			});

		fetchServices();


	}

	useEffect(() => {
		const fetchAddress = async () => {
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
								address,
								userID
							} = doc.data();
							// console.log(address.lat)
							if (doc.data().userID == user) {
								list.push({
									lat: address.lat,
									lng: address.lng
								});
							}
						});
					});

				setUserAddress(list);
				setFetch(false);
				// console.log(userAddress)

			} catch (e) {
				console.log(e);
			}
		};
		fetchAddress();

	}, [Fetch])

	const fetchServices = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Services')
				.where('user', '==', user)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						const {
							name,
							description,
							price,
							priceUnit,
							priceID,
							image,
							created,
						} = doc.data();
							list.push({
								id: doc.id,
								name: name,
								description: description,
								price: price,
								priceUnit: priceUnit,
								priceID: priceID,
								image: image,
								created: created
							});
					});
				});
			setServiceList(list);
			setFetch(false);
			// console.log("serviceList: " + JSON.stringify(serviceList[0].image))

		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		// console.log(JSON.stringify(image))

		fetchServices();

	}, [Fetch])

	const createStripePrice = async (serviceType) => {
		const data = { name: name, price: price * 100 }
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'priceCreation')(data).then(function (result) {
			addService(result.data.product.id, result.data.price.id, serviceType);
			const price = result.data.price;
			const product = result.data.product;
			return {
				price: price,
				product: product
			};
		}).catch(console.log)
		return response
	};

	const deleteStripePrice = async (priceID) => {
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'priceDeletion')(priceID).then(function (result) {
			const deleted = result.data.deleted;
			return {
				deleted: deleted
			};
		}).catch(console.log)
		return response
	};

	const addSaveService = async (serviceType) => {
		// await addService();
		createStripePrice(serviceType)
		setModalVisible(false);
		setModalVisible3(false);
		setFetch(true);
		setName("");
		setDescription("");
		setPrice("");
		setImage("")
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.35,
		});

		// console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
			// console.log("image: " + JSON.stringify(result))
		}
	};

	const handleItemPickerChange = (value) => {
		setpriceMeasurementUnits(value);
		console.log(value)
	};


	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>My Services</Text>
			</View>

			<SafeAreaView style={styles.container2}>

				<FlatList
					data={serviceList}
					keyExtractor={(item) => item.id}
					extraData={serviceList}
					ListFooterComponent={<View style={{ height: 90 }} />}
					renderItem={({ item, separators }) => (
						<SafeAreaView >
							<TouchableOpacity onPress={() => navigation.navigate("ServicesAdditional", { serviceName: item.name })}>
								<View style={styles.serviceHolder}>
									<View style={{ flex: 1 }}>

										<Image style={{
											width: 390,
											height: 155,
											position: "absolute",
											borderRadius: 20,
										}}
											source={{
												uri: item.image,
											}} />
									</View>
									<View style={{ position: "absolute", top: Dimensions.get("screen").height * 0.20 }}>

										<Text style={{ color: "black", fontWeight: "bold" }} >
											<Text style={{ color: "black", fontSize: 25, fontWeight: "bold" }}> {item.name} </Text>
											<Text style={{ fontSize: 20 }}>{item.price} ({item.priceUnit})</Text>
										</Text>
										<Text style={{ color: "gray", fontWeight: "bold", fontSize: 18 }}> {item.description}</Text>

									</View>
								</View>

								<View style={styles.edit}>
									<EditButton onPress={editModalOpen}> </EditButton>
								</View>
								<View style={styles.delete}>
									<DeleteButton onPress={() =>
										Alert.alert("Services",
											"Are you sure you want to delete this service?",
											[
												{
													text: "Yes",
													onPress: () => { deleteService(item.id, item.name), deleteStripePrice(item.priceID) },
												},
												{ text: "No", onPress: () => console.log("OK Pressed") }
											])}> </DeleteButton>
								</View>
							</TouchableOpacity>

							<View>

								<SafeAreaView >
									<SwipeUpDownModal
										modalVisible={modalVisible2}
										PressToanimate={animateModal}
										//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
										ContentModal={
											<Pressable onPress={() => Keyboard.dismiss()}>
												<View style={styles.modalView2}>
													<View style={styles.container3}>

														<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 15, }}>Edit Service</Text>
														<CustomInput
															placeholder="Service"
															value={name}
															setValue={setName}
															autoCorrect={true}
															autoCapitalize={"words"}
														/>
														<CustomInput
															placeholder="Description"
															value={description}
															setValue={setDescription}
															autoCorrect={true}
															autoCapitalize={"sentences"}
														/>
														<NumberInput
															placeholder="Price"
															value={price}
															setValue={setPrice}
															autoCorrect={true}
															autoCapitalize={"none"}
														/>

														<ModalButtons
															text="Save Service"
															onPress={() => editService(item.id)}
														/>
														<ModalButtons
															text="Add Banner"
															onPress={pickImage}
														/>

														<ModalButtons
															text="Cancel"
															onPress={() => setModalVisible2(false)}
														/>
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
											setModalVisible2(false);
											setanimateModal(false);
										}}
									/>

								</SafeAreaView>

							</View>
						</SafeAreaView>


					)}
				/>

			</SafeAreaView>


			<SafeAreaView >

				<SwipeUpDownModal
					modalVisible={modalVisible}
					PressToanimate={animateModal}
					//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
					ContentModal={
						<Pressable onPress={() => Keyboard.dismiss()}>
							<View style={styles.modalView}>
								<View style={styles.container3}>
									<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 40, }}>Add Service</Text>

									<KeyboardAvoidingView behavior="height" style={{ flex: 1 }} >
										<CustomInput
											placeholder="Service Offered"
											value={name}
											setValue={setName}
											autoCorrect={true}
											autoCapitalize={"words"}
										/>
										<CustomInput
											placeholder="Describe your service"
											value={description}
											setValue={setDescription}
											autoCorrect={true}
											autoCapitalize={"sentences"}
										/>

										<View style={{ flexDirection: "row" }}>
											<NumberInput
												placeholder="Price"
												value={price}
												setValue={setPrice}
												autoCorrect={true}
												autoCapitalize={"none"}
											/>

											{/* <View style={{ backgroundColor: "transparent", height: screenHeight * 0.06, width: screenWidth * 0.45, justifyContent: "center", borderColor: "black", borderRadius: 10, borderWidth: 0.35, marginTop: 5, marginLeft: 2 }}> */}
											<RNPickerSelect
												style={pickerStyle}
												placeholder={{ label: "Slect a price unit...", value: "default" }}
												onValueChange={(value) => setPricePickerValue(value)}
												items={[
													{ label: '$', value: '$' },
												]}
											/>
											{/* </View> */}
										</View>


										<ModalButtons
											text="Add Picture"
											onPress={pickImage}
										/>


										<ModalButtons
											text="Add Service"
											onPress={() => { addSaveService("Not quotable") }}
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

			<SafeAreaView >

				<SwipeUpDownModal
					modalVisible={modalVisible3}
					PressToanimate={animateModal}
					//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
					ContentModal={
						<Pressable onPress={() => Keyboard.dismiss()}>
							<View style={styles.modalView}>
								<View style={styles.container3}>
									<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 40, }}>Add Quotable Service</Text>

									<KeyboardAvoidingView behavior="height" style={{ flex: 1 }} >
										<CustomInput
											placeholder="Service Offered"
											value={name}
											setValue={setName}
											autoCorrect={true}
											autoCapitalize={"words"}
										/>
										<CustomInput
											placeholder="Describe your service"
											value={description}
											setValue={setDescription}
											autoCorrect={true}
											autoCapitalize={"sentences"}
										/>

										<View style={{ flexDirection: "row" }}>
											<NumberInput
												placeholder="Price"
												value={price}
												setValue={setPrice}
												autoCorrect={true}
												autoCapitalize={"none"}
											/>

											{/* <View style={{ backgroundColor: "transparent", height: screenHeight * 0.06, width: screenWidth * 0.45, justifyContent: "center", borderColor: "black", borderRadius: 10, borderWidth: 0.35, marginTop: 5, marginLeft: 2 }}> */}
											<RNPickerSelect
												style={pickerStyle}
												placeholder={{ label: "Slect a price unit...", value: "default" }}
												onValueChange={(value) => setPricePickerValue(value)}
												items={[
													{ label: '$/hr', value: '$/hr' },
													{ label: '$/sqft', value: '$/sqft' },
													{ label: '$/month', value: '$/month' },
												]}
											/>
											{/* </View> */}
										</View>


										<ModalButtons
											text="Add Picture"
											onPress={pickImage}
										/>


										<ModalButtons
											text="Add Service"
											onPress={() => { addSaveService("quotable") }}
										/>

										<ModalButtons
											text="Cancel"
											onPress={() => setModalVisible3(false)}
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
						setModalVisible3(false);
						setanimateModal(false);
					}}
				/>


			</SafeAreaView>

			<SafeAreaView >

				<SwipeUpDownModal
					modalVisible={modalVisible1}
					PressToanimate={animateModal}
					//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
					ContentModal={
						<Pressable onPress={() => Keyboard.dismiss()}>
							<View style={styles.modalView}>
								<View style={styles.container3}>
									<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 40, }}>Pick a Type of Service</Text>

									<ModalButtons
										text="Regular Service"
										onPress={() => { setModalVisible(true), setModalVisible1(false) }}
									/>

									<ModalButtons
										text="Quote or Invoice Service"
										onPress={() => { setModalVisible3(true), setModalVisible1(false) }}
									/>

									<ModalButtons
										text="Cancel"
										onPress={() => setModalVisible1(false)}
									/>

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
						setModalVisible1(false);
						setanimateModal(false);
					}}
				/>


			</SafeAreaView>



			<View style={{ position: "absolute", top: 45, left: 335 }}>
				<PlusButton
					text="Add Service"
					onPress={() => setModalVisible1(true)}
				/>

			</View>

		</SafeAreaView >
	);
};

const pickerStyle = {
	inputIOS: {
		height: Dimensions.get("window").height * 0.065,
		width: Dimensions.get("window").width * 0.4,
		marginTop: 5,
		marginLeft: 5,
		color: "black",
		paddingTop: 13,
		paddingHorizontal: 10,
		paddingBottom: 12,
		borderWidth: 0.35,
		borderRadius: 15,
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
		height: Dimensions.get("screen").height * 0.3,
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
		width: Dimensions.get("screen").width * 0.3,
		height: Dimensions.get("screen").height * 0.12,
		borderRadius: 20,
	},

	edit: {
		position: "absolute",
		bottom: 40,
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

	pickerContainer: {
		backgroundColor: "red",
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	pickerDevider: {
		borderColor: 'rgba(0,0,0,0.1)',
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	pickerItemLabel: {
		color: 'black',
		fontSize: 25,
	},

	inputIOS: {
		fontSize: 20,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'blue',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: 'purple',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	},
	absolute: {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	}

});
export default Services2;