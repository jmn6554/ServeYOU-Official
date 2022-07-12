import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, KeyboardAvoidingView, TouchableOpacity, SectionList, Pressable, Keyboard } from "react-native";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import { useNavigation, NavigationContainer, useIsFocused } from "@react-navigation/native";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { abs } from "react-native-reanimated";
import CustomButton from "../Components/CustomButtons/CustomButton";
import * as Haptics from 'expo-haptics';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import XButton from "../Components/CustomButtons/XButton";


const Services2 = ({ route }) => {
	const [serviceList, setServiceList] = useState("");
	const [Fetch, setFetch] = useState("");
	const [checkColor, setCheckColor] = useState("")
	const check = useRef([])
	const [count, setCount] = useState(0)
	const [reload, setReload] = useState(0)
	const [cartCount, setCartCount] = useState("")
	const [cart, setCart] = useState([])
	const [modalVisible, setModalVisible] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	const navigation = useNavigation();
	const [priceIDArray, setPriceIDArray] = useState([route.params.priceID]);

	// console.log(route.params.quotable)

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				var counter = count
				const list = [];
				const checkMarkList = [];
				const db = firebase.firestore();
				const user = auth.currentUser.uid;
				await db
					.collection('Options&Packages')
					.where('user', '==', route.params.userID)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const {
								name,
								description,
								price,
								priceID,
								image,
								created,
								category,
								serviceName,
							} = doc.data();
							if (serviceName == route.params.serviceName) {
								list.push({
									title: category,
									data: [{
										id: doc.id,
										name: name,
										description: description,
										price: price,
										priceID: priceID,
										image: image,
										created: created
									}]
								});
								counter = counter + 1
								setCount(counter)

								checkMarkList.push({
									[name]: "transparent",
								})

								check.current = checkMarkList
							}
						});
					});

				var filter_data = {};
				list.forEach(e => {
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
		fetchOptions();

	}, [Fetch])

	const checkBoxState = (id, name) => {
		var count = reload
		count += 1

		if (check.current[name] == "transparent" || check.current[name] == undefined) {
			check.current[name] = "#0b84db"
			// console.log(check.current[name])
		}
		else {
			check.current[name] = "transparent"
			// console.log(check.current[name])
		}
		setReload(count)

	}

	// const cartChecker = () => {
	//   var count = 0
	//   cart.forEach(e => {
	//     if (e !== null) {
	//       count = count += 1
	//     }
	//   })
	//   setCartCount(count)
	// }

	const addCartItems = (index, name, description, price) => {
		var listID = index
		var count = 0
		var foundElement = ""

		cart.forEach(e => {
			if (e.name == name) {
				count = count + 1
				foundElement = cart.indexOf(e)
			}
			else {
				null
			}
		});

		if (count == 0) {
			cart.push({ id: index, name: name, description: description, price: price })
			setCart(cart)
		}
		else {
			cart.splice(foundElement, 1)
			setCart(cart)
		}
	}

	const mergePriceID = (itemName, priceID) => {
		// console.log(check.current[itemName])
		if (check.current[itemName] == "transparent") {
			var index = priceIDArray.indexOf(priceID)
			priceIDArray.splice(index, 1)
			setPriceIDArray(...priceIDArray)
		}
		else if (check.current[itemName] == "#0b84db") {
			priceIDArray.push(priceID)
		}
		console.log(priceIDArray)
	}

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
	// console.log(JSON.stringify(route.params.cartItems.current))

	return (
		<SafeAreaView style={styles.container} >
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Service Options</Text>
			</View>

			<SafeAreaView>

				<SwipeUpDownModal
					modalVisible={modalVisible}
					PressToanimate={animateModal}
					ContentModal={
						<View style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
							<View style={{ marginBottom: 30, marginTop: 10 }}>
								<XButton onPress={() => setModalVisible(false)}></XButton>
							</View>
							<View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
								<Text style={{ fontSize: 25 }}>Availabilities</Text>
							</View>
							<View>

								<Calendar
									onDayPress={day => {
										navigation.navigate("Agenda", { date: day.dateString, userID: route.params.userID, cartItems: route.params.cartItems, companyName: route.params.companyName, cartOptions: cart, quotable: route.params.quotable, priceID: route.params.priceID, productID: route.params.productID, priceUnit: route.params.priceUnit })
										setModalVisible(false)
										console.log(day)
										// console.log(day.dateString)
									}}
									markedDates={
										// '2022-03-16': { selected: true, marked: true, selectedColor: 'blue' },
										// '2022-03-18': { disabled: true, disableTouchEvent: true },
										// '2022-03-19': { disabled: true, disableTouchEvent: true }
										mark
									}
									pastScrollRange={0}
									futureScrollRange={3}
									minDate={new Date()}
								/>

							</View>

						</View>
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

			<SafeAreaView style={styles.container2}>

				<SectionList
					sections={serviceList}
					stickySectionHeadersEnabled
					keyExtractor={(item) => item.id}
					extraData={serviceList}
					renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>Choose your {section.title}</Text>}
					ListFooterComponent={<View style={{ height: 90 }} />}
					renderItem={({ item, index }) => (

						<SafeAreaView >
							<View style={styles.serviceHolder}>
								<Text style={{ color: "black", fontWeight: "bold" }} >
									<Text style={{ color: "black", fontSize: 25 }}> {item.name}</Text> <Text style={{ fontSize: 18 }}>${item.price}</Text>
								</Text>

								<Text style={{ color: "gray", fontWeight: "bold", fontSize: 18 }}>{item.description}</Text>

								<TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), checkBoxState(index, item.name), addCartItems(index, item.name, item.description, item.price, item.priceID), mergePriceID(item.name, item.priceID) }}>
									<View style={{ width: 30, height: 30, borderColor: "black", borderWidth: 1.2, borderRadius: 10, backgroundColor: check.current[item.name], position: "absolute", right: "7%", bottom: "10%" }}>

										<Ionicons
											name="checkmark-sharp"
											type="ionicon"
											color="white"
											size="25"
										/>

									</View>
								</TouchableOpacity>

							</View>

						</SafeAreaView>
					)
					}
				/>



				<View style={{ marginBottom: "10%" }}>
					{cart[0] != null ? <CustomButton text="Check Availabilities" onPress={() => setModalVisible(true)} /> : null}
				</View>

			</SafeAreaView >


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
		// justifyContent: "center"
	},

	Modal: {
		backgroundColor: 'transparent',
		marginTop: "100%",
	},

	containerContent: { flex: 1, marginTop: "90%" },

	containerHeader: {
		flex: 1,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		height: 5,
		width: 90,
		backgroundColor: 'white',
		marginTop: "90%",
		borderRadius: 50
	},

	headerContent: {
		marginTop: "3%",
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},

	sectionHeader: {
		fontSize: 23,
		fontWeight: "normal",
		marginBottom: 10,
		marginTop: 15,
		backgroundColor: "#ebedf0"
	}


});
export default Services2;