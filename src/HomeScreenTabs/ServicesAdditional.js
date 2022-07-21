import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView, TouchableOpacity, SectionList, Pressable, Keyboard } from "react-native";
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
import { getFunctions, httpsCallable } from 'firebase/functions';
import LottieView from 'lottie-react-native';

const Services2 = ({ route }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [serviceList, setServiceList] = useState("");
	const [userAddress, setUserAddress] = useState("");
	const [Fetch, setFetch] = useState("");
	const [image, setImage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	const [animateModal2, setanimateModal2] = useState(true);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [loading, setLoading] = useState(false);
	const ref = React.useRef();
	const [items, setItems] = useState([
		{ label: 'Options', value: 'Options' },
		{ label: 'Packages', value: 'Packages' }
	]);

	// console.log("serviceName:" + route.params.serviceName)

	useEffect(() => {
		fetchServices();
	}, [Fetch])

	const addService = async (priceID) => {
		const db = firebase.firestore();
		const user = auth.currentUser.uid;
		await db.collection("Options&Packages").add({
			category: value,
			serviceName: route.params.serviceName,
			name: name,
			description: description,
			price: price,
			priceID: priceID,
			user: user,
			created: firebase.firestore.Timestamp.now(),
		}).then(() => { console.log("Option/Package Added") })
		fetchServices();
		setLoading(false);

	}

	const deleteService = async (id) => {
		console.log("deleted")
		const db = firebase.firestore();
		await db
			.collection('Options&Packages')
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					if (doc.id == id) {
						db.collection("Options&Packages").doc(id).delete();
					}
				});
				setName("");
				setDescription("");
				setPrice("");
			});
		fetchServices();

	}

	const editService = async (id) => {

		const db = firebase.firestore();
		const user = auth.currentUser.uid;
		await db
			.collection('Options&Packages')
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					if (doc.id == id) {
						db.collection("Options&Packages").doc(id).set({
							user: user,
							serviceName: route.params.serviceName,
							optionName: name,
							description: description,
							price: price,
							address: userAddress,
							image: image,
							created: firebase.firestore.Timestamp.now(),
						})
					}
				});
				setModalVisible2(false);
				setFetch(true);
			});
		fetchServices();
	}

	const fetchServices = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('Options&Packages')
				// .orderBy("category")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						const {
							name,
							description,
							price,
							image,
							created,
							category,
							serviceName
						} = doc.data();
						if (doc.data().user == user && serviceName == route.params.serviceName) {
							list.push({
								title: category,
								data: [{
									id: doc.id,
									name: name,
									description: description,
									price: price,
									image: image,
									created: created
								}]
							});
						}
					});
				});

			var filter_data = {};
			list.forEach(e => {
				console.log(e.data)
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

	const createStripePrice = async () => {
		const data = { name: name, price: price * 100 }
		const functions = getFunctions()
		const response = await httpsCallable(functions, 'priceCreation')(data).then(function (result) {
			addService(result.data.price.id);
			const price = result.data.price;
			const product = result.data.product;
			return {
				price: price,
				product: product
			};
		}).catch(console.log)
		return response
	};


	const addSaveService = () => {
		setLoading(true);
		createStripePrice();
		setModalVisible(false);
		setFetch(true);
		setName("");
		setDescription("");
		setPrice("");
	}

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
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Service Options</Text>
			</View>

			{loading == false ? <SafeAreaView style={styles.container2}>

				<SectionList
					sections={serviceList}
					stickySectionHeadersEnabled
					keyExtractor={(item) => item.id}
					extraData={serviceList}
					renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
					ListFooterComponent={<View style={{ height: 90 }} />}
					renderItem={({ item, separators }) => (

						<SafeAreaView >
							<TouchableOpacity onPress={() => console.log(item.id)}>
								<View style={styles.serviceHolder}>

									<Text style={{ color: "black", fontWeight: "bold" }} >
										<Text style={{ color: "black", fontSize: 25 }}> {item.name}  </Text> <Text style={{ fontSize: 18 }}>${item.price}</Text>
									</Text>

									<Text style={{ color: "gray", fontWeight: "bold", fontSize: 18 }}> {item.description}</Text>
								</View>

								<View style={styles.edit}>
									<EditButton onPress={() => setModalVisible2(true)}> </EditButton>
								</View>
								<View style={styles.delete}>
									<DeleteButton onPress={() =>
										Alert.alert("Services",
											"Are you sure you want to delete this service?",
											[
												{
													text: "Yes",
													onPress: () => deleteService(item.id),
												},
												{ text: "No", onPress: () => console.log("OK Pressed") }
											])}> </DeleteButton>
								</View>
							</TouchableOpacity>

							<View>

								<SafeAreaView>

									<SwipeUpDownModal
										modalVisible={modalVisible2}
										PressToanimate={animateModal2}
										//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
										ContentModal={
											<Pressable onPress={() => Keyboard.dismiss()}>
												<View style={styles.modalView2}>
													<View style={styles.container3}>

														<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 15, }}>Edit Option or Package</Text>
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
											setanimateModal2(false);
										}}
									/>

								</SafeAreaView>


							</View>
						</SafeAreaView>


					)}
				/>

			</SafeAreaView>
				: <LottieView source={require("../../assets/50738-loading-line.json")} autoPlay loop ref={ref} />}

			<SafeAreaView >

				<SwipeUpDownModal
					modalVisible={modalVisible}
					PressToanimate={animateModal}
					//if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
					ContentModal={
						<Pressable onPress={() => Keyboard.dismiss()}>
							<View style={styles.modalView}>
								<View style={styles.container3}>
									<Text style={{ fontSize: 30, fontWeight: "bold", color: "black", marginBottom: 10, }}>Add Option or Package</Text>

									<KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>

										<DropDownPicker
											containerStyle={{
												width: "87%",
												marginTop: 20,
												marginBottom: 5
											}}
											placeholderStyle={{
												fontWeight: "normal"
											}}
											placeholder="Select One"
											mode="BADGE"
											open={open}
											value={value}
											items={items}
											setOpen={setOpen}
											setValue={setValue}
											setItems={setItems}
											onSelectItem={(item) => {

											}}
										/>

										<CustomInput
											placeholder="Option/Package Name"
											value={name}
											setValue={setName}
											autoCorrect={true}
											autoCapitalize={"words"}
										/>

										<CustomInput
											placeholder="Option/Package Description"
											value={description}
											setValue={setDescription}
											autoCorrect={true}
											autoCapitalize={"sentences"}
										/>

										<NumberInput
											placeholder="+ Added to Total Price"
											value={price}
											setValue={setPrice}
											autoCorrect={true}
											autoCapitalize={"none"}
										/>

										<ModalButtons
											text="Add Service"
											onPress={addSaveService}
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


			<View style={{ position: "absolute", top: 45, left: 335 }}>
				<PlusButton
					text="Add Service"
					onPress={() => setModalVisible(true)}
				/>

			</View>

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
		width: 390,
		height: 75,
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
		bottom: 20,
		right: 5,

	},

	delete: {
		position: "absolute",
		top: 30,
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

	sectionHeader: {
		fontSize: 20,
		fontWeight: "bold"
	}


});
export default Services2;