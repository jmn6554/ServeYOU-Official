import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native'
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Availabilities1 from '../Components/CustomButtons/Availabilities1';
import XButton from "../Components/CustomButtons/XButton"
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const Agendas = ({ route }) => {
	// const [agenda1, setAgenda1] = useState(true)
	const agenda = [13]
	const [scheduleList, setScheduleList] = useState("")
	const [modalVisible, setModalVisible] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	// const startTime = 8
	// const closingTime = 16
	// const interval = 2
	// const numberOfSlots = (Math.abs(startTime - closingTime) / interval)
	const [priceSum, setPriceSum] = useState(0);
	const [selectedTime, setSelectedTime] = useState("");
	const navigation = useNavigation();
	const [customerID, setCustomerID] = useState("");


	useEffect(() => {
		scheduler()

	}, [])

	const scheduler = () => {
		const list = []
		var startTime = 8
		const closingTime = 16
		const interval = 0.25
		const numberOfSlots = (Math.abs(startTime - closingTime) / interval)
		var count = 0
		// console.log(numberOfSlots)

		while (count < numberOfSlots) {
			count += 1
			if (agenda.includes(startTime)) {
				// console.log("included")
				startTime += interval
			}
			else {
				list.push({ time: startTime, interval: interval, decimal: startTime - Math.floor(startTime) })
				startTime += interval
			}
		}

		setScheduleList(list)
	}

	const addToCart = async () => {
		var cartCounter = 0;
		const db = firebase.firestore();
		const user = auth.currentUser.uid;
		await db.collection("Cart").add({
			user: user,
			subTotal: priceSum,
			companyName: route.params.companyName,
			serviceName: route.params.cartItems,
			priceUnit: route.params.priceUnit,
			cartOptions: route.params.cartOptions,
			selectedTime: selectedTime,
			selectedDay: route.params.date,
			providerID: route.params.userID
		}).then(() => { console.log("Service Added") })
		global.cartCount += 1;
		// global.cartItemCounter = cartCounter;
	}

	useEffect(() => {
		const getUsers = async () => {
			try {
				const list = []
				const db = firebase.firestore();
				await db
					.collection('Users')
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							if (doc.data().userID == route.params.userID) {
								list.push({
									startTime: doc.data().startTime,
									closingTime: doc.data().closingTime,
									interval: doc.data().interval,
									jobDates: doc.data().jobDates
								})
							}
						});
					});

			} catch (e) {
				console.log(e);
			}
		};
		getUsers();
	}, [])

	useEffect(() => {
		const getUsers = async () => {
			try {
				const list = []
				const db = firebase.firestore();
				await db
					.collection('Users')
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							if (doc.data().userID == auth.currentUser.uid) {
								setCustomerID(doc.data().customerID)
								list.push({
									customerID: doc.data().customerID
								})
							}
						});
					});

			} catch (e) {
				console.log(e);
			}
		};
		getUsers();
	}, [])

	useEffect(() => {
		// console.log(route.params.cartItems.price)
		var optionPriceSum = 0
		route.params.cartOptions.forEach(e => optionPriceSum = optionPriceSum + Number(e.price))
		optionPriceSum = Number(route.params.cartItems.current.price) + optionPriceSum
		setPriceSum(Math.round(optionPriceSum * 100) / 100)
	}, [])

	const addToOrders = async () => {
		var cartCounter = 0;	
		const db = firebase.firestore();
		const user = auth.currentUser.uid;
		await db.collection("Orders").add({
			user: user,
			subTotal: priceSum,
			companyName: route.params.companyName,
			serviceName: route.params.cartItems,
			productID: route.params.productID,
			priceID: route.params.priceID,
			priceUnit: route.params.priceUnit,
			customerID: customerID,
			cartOptions: route.params.cartOptions,
			selectedTime: selectedTime,
			selectedDay: route.params.date,
			providerID: route.params.userID,
			quotable: route.params.quotable
		}).then(() => { console.log("Service Added") })
		// global.cartItemCounter = cartCounter;
	}

	return (
		<View style={styles.container}>
			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0 }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 40, fontWeight: "bold" }}>Availabilities</Text>
				<Text style={{ fontSize: 15 }}>{route.params.date}</Text>
			</View>

			<SwipeUpDownModal
				modalVisible={modalVisible}
				PressToanimate={animateModal}
				ContentModal={
					<View style={{ backgroundColor: "white", width: "100%", height: Dimensions.get("screen").height * 0.5, marginTop: "10%", alignItems: "center" }}>
						<XButton onPress={() => setModalVisible(false)}></XButton>
						<View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", flexDirection: "row" }}>
							<Text style={{ fontSize: 30, fontWeight: "bold" }}>Pricing</Text>
							<Ionicons
								name="card"
								type="ionicon"
								color="black"
								size="28"
							/>
						</View>
						<View style={{ alignItems: "flex-end" }}>
							<Text style={{ fontSize: 20, marginTop: "20%" }}>{route.params.companyName} • {route.params.cartItems.current.name} • ${route.params.cartItems.current.price}</Text>
							{route.params.cartOptions.map(e => {
								return (<Text style={{ fontSize: 20 }}>{e.name} • ${e.price}</Text>)
							})}
						</View>
						<View style={{ position: "absolute", top: "70%" }}>
							
							<Availabilities1 text={"Buy Now" + " • " + "$" + priceSum}></Availabilities1>
							{route.params.quotable != "quotable" ?
							<Availabilities1 onPress={() => { addToCart(), setModalVisible(false), navigation.navigate("HomeReceiver") }} text="Add to Cart"></Availabilities1> : <Availabilities1 onPress={() => { addToOrders(), setModalVisible(false), navigation.navigate("HomeReceiver") }} text="Request Quote"></Availabilities1>
				}
						</View>

					</View>
				}

				HeaderStyle={styles.headerContent}
				ContentModalStyle={styles.Modal}
				HeaderContent={
					< View style={styles.containerHeader} >
					</View >
				}
				onClose={() => {
					setModalVisible(false);
					setanimateModal(false);
				}}
			/>


			< SafeAreaView style={{ marginTop: 60 }}>
				<FlatList
					data={scheduleList}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					extraData={scheduleList}
					renderItem={({ item, separators }) => (
						<Availabilities1 onPress={() => { setModalVisible(true), setSelectedTime(item.time) }} text={item.interval < 1 && item.time % 1 != 0 ? Math.trunc(item.time) + ":" + ((item.decimal * 60 / 100) * 100) : item.time + ":00"} />
					)}
				/>
			</SafeAreaView >


		</View >
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignContent: "center",
		alignItems: "center",
		justifyContent: "center",
		width:
			"100%",
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
		marginTop: Dimensions.get("window").height * 0.38,
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
		marginTop: Dimensions.get("window").height * 0.4,
	}
});

export default Agendas;