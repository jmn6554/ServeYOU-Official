import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView, TouchableOpacity, Pressable, Keyboard, Dimensions, TouchableHighlight } from "react-native";
import CustomInput from "../Components/CustomInput";
import ModalButtons from "../Components/CustomButtons/ModalButtons";
import PlusButton from "../Components/CustomButtons/PlusButton"
import DeleteButton from "../Components/CustomButtons/DeleteButton"
import EditButton from "../Components/CustomButtons/EditButton"
import NumberInput from "../Components/CustomInput/NumberInput"
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import * as ImagePicker from 'expo-image-picker'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { useNavigation } from "@react-navigation/native";
import "firebase/compat/storage";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import RNPickerSelect from 'react-native-picker-select';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { SliderBox } from "react-native-image-slider-box";
import uuid from 'react-native-uuid';

const Services2 = () => {
	const screenHeight = Dimensions.get("screen").height;
	const screenWidth = Dimensions.get("screen").width;
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [serviceList, setServiceList] = useState("");
	const [docID, setDocID] = useState("");
	const [Fetch, setFetch] = useState("");
	const [image, setServiceImage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible1, setModalVisible1] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [modalVisible3, setModalVisible3] = useState(false);
	const [modalVisible4, setModalVisible4] = useState(false);
	const [animateModal, setanimateModal] = useState(false);
	const navigation = useNavigation();
	const [pricePickerValue, setPricePickerValue] = useState("");
	const [showCaseImages, setShowCaseImages] = useState([""]);
	const [showCaseImageIndex, setShowCaseImageIndex] = useState("");

	useEffect(() => {
		fetchServices();
	}, [Fetch])

	// console.log(showCaseImages);

	const addShowCasePicture = async (imagePicked) => {
		var showCaseImagesTemp = [...showCaseImages];
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
			xhr.open("GET", imagePicked, true);
			xhr.send(null);
		});

		const ref1 = ref(getStorage(), "showcase/" + user + uuid.v1());
		const result = await uploadBytesResumable(ref1, blob);
		const imageURL = await getDownloadURL(ref1);

		showCaseImagesTemp.push(imageURL)

		setShowCaseImages(showCaseImages => [...showCaseImages, imageURL]);

		updateUserShowCase(showCaseImagesTemp);

		setModalVisible4(false);

		blob.close();
	}

	const deleteShowCaseImage = () => {
		var showCaseImagesTemp = [...showCaseImages];

		showCaseImagesTemp.splice(showCaseImageIndex, 1);

		setShowCaseImages(showCaseImagesTemp);

		updateUserShowCase(showCaseImagesTemp);

		setModalVisible4(false);
	}

	const updateUserShowCase = (newShowCase) => {
		const db = firebase.firestore();
		const user = auth.currentUser.uid;
		db.collection("Users").doc(docID).update({ showCaseImages: newShowCase });
	}


	const addService = async (productID, priceID, serviceType) => {
		const db = firebase.firestore();
		const user = auth.currentUser.uid;

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
		const fetchUserInfo = async () => {
			try {
				const list = [];
				const db = firebase.firestore();
				const user = auth.currentUser.uid;
				await db
					.collection('Users')
					.where("userID", "==", user)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const {
								showCaseImages
							} = doc.data();

							setDocID(doc.id)

							if (showCaseImages != undefined) {
								setShowCaseImages(showCaseImages)
							}
							else {
								setShowCaseImages([])
							}
						});
					});
				// console.log(docID)
				setFetch(false);
				// console.log(userAddress)

			} catch (e) {
				console.log(e);
			}
		};
		fetchUserInfo();

	}, [])

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
		setServiceImage("")
	}

	const pickServiceImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.35,
		});

		// console.log(result);

		if (!result.cancelled) {
			setServiceImage(result.uri);
		}
	};

	const pickShowcaseImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.35,
		});

		if (!result.cancelled) {
			// setShowCaseImagePicked(result.uri);
			addShowCasePicture(result.uri);
		}
	};

	const handleItemPickerChange = (value) => {
		setpriceMeasurementUnits(value);
		console.log(value)
	};


	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "#769ECB", height: screenHeight * 0.12, width: screenWidth, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: screenHeight * 0.02, fontWeight: "bold" }}>My Services</Text>
			</View>

			<SafeAreaView style={styles.container2}>

				<FlatList
					data={serviceList}
					keyExtractor={(item) => item.id}
					extraData={serviceList}

					ListHeaderComponent=
					{showCaseImages != "" ?
						<View style={{ marginBottom: 20, zIndex: 2 }} onLongPress={() => console.log("hey")}>
							<SliderBox
								ImageComponentStyle={{ borderRadius: 15, width: '97%' }}
								onCurrentImagePressed={index => { setModalVisible4(true), setShowCaseImageIndex(index) }}
								autoPlay
								sliderBoxHeight={screenHeight * 0.25} images={showCaseImages} />
						</View> :
						<TouchableOpacity style={{ height: screenHeight * 0.15, width: screenWidth * 0.99, marginBottom: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#769ECB", borderRadius: 25, marginStart: 2 }} onPress={() => pickShowcaseImage()}>
							<Text style={{ fontWeight: "500", fontSize: 20 }}>Add Showcase</Text>
						</TouchableOpacity>}

					ListFooterComponent={<View style={{ height: screenHeight * 0.05 }} />}
					renderItem={({ item, separators }) => (
						<SafeAreaView >
							<TouchableOpacity onPress={() => navigation.navigate("ServicesAdditional", { serviceName: item.name })}>
								<View style={styles.serviceHolder}>
									<View style={{ flex: 1 }}>

										<Image style={{
											width: screenWidth,
											height: screenHeight * 0.19,
											position: "absolute",
											borderRadius: 20,
										}}
											source={{
												uri: item.image,
											}} />
									</View>
									<View style={{ position: "absolute", top: screenHeight * 0.2 }}>

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
															onPress={pickServiceImage}
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

								<SafeAreaView >
									<SwipeUpDownModal
										modalVisible={modalVisible3}
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
															onPress={pickServiceImage}
														/>

														<ModalButtons
															text="Cancel"
															onPress={() => setModalVisible3(false)}
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
											setModalVisible3(false);
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
											onPress={pickServiceImage}
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
					modalVisible={modalVisible4}
					PressToanimate={animateModal}
					//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
					ContentModal={
						<Pressable onPress={() => Keyboard.dismiss()}>
							<View style={styles.modalView4}>
								<View style={styles.container3}>
									<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 40 }}>Edit Show Case</Text>

									<ModalButtons
										text="Add Picture"
										onPress={pickShowcaseImage}
									/>

									<ModalButtons
										text="Delete Current Image"
										onPress={() => deleteShowCaseImage()}
									/>

									<ModalButtons
										text="Cancel"
										onPress={() => setModalVisible4(false)}
									/>

								</View>
							</View>
						</Pressable>
					}
					HeaderStyle={styles.headerContent4}
					ContentModalStyle={styles.Modal}
					HeaderContent={
						<View style={styles.containerHeader}>

						</View>
					}
					onClose={() => {
						setModalVisible4(false);
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

			<View style={{ position: "absolute", top: screenHeight * 0.05, left: screenWidth * 0.85 }}>
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
		height: "100%",
	},

	container2: {
		alignItems: "center",
		justifyContent: "center",
		alignContent: "center",
		padding: 15,
		width: "100%",
		height: Dimensions.get("screen").height * 0.85,
		marginTop: Dimensions.get("screen").height * 0.08,
		// position: "relative",
		// top: "3%"

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
		marginTop: Dimensions.get("screen").height * 0.15,
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

	modalView4: {
		height: "100%",
		width: "100%",
		alignContent: "center",
		marginTop: Dimensions.get("screen").height * 0.45,
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
		top: Dimensions.get("screen").height * 0.18,
		right: 5,
	},

	delete: {
		position: "absolute",
		top: Dimensions.get("screen").height * 0.23,
		right: 5,
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

	headerContent4: {
		marginTop: Dimensions.get("screen").height * 0.32,
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