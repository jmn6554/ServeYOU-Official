import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, FlatList, Modal, Image, TouchableOpacity, Pressable, RefreshControl } from "react-native";
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification } from "../../Firebase";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation, NavigationContainer, useIsFocused } from "@react-navigation/native";
import * as Haptics from 'expo-haptics';


const ChatList = () => {
	const [address, setAddress] = useState("");
	const [serviceList, setServiceList] = useState("");
	const [currentAddress, setCurrentAddress] = useState(Object);
	const [Chats, setChats] = useState([]);
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = useState(false);
	const [Fetch, setFetch] = useState(false)
	const [passedUser, setPassedUser] = useState("")
	const isFocused = useIsFocused();

	//checks if user is using the chatlist and will re-render
	useEffect(() => {
		if (isFocused) {
			fetchChats();
		}
	}, [isFocused])

	const fetchChats = async () => {
		try {
			const list = [];
			const db = firebase.firestore();
			const user = auth.currentUser.uid;
			await db
				.collection('ChatRooms')
				.where("usersArray", "array-contains", user)
				.orderBy("latestMessage", "desc")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						const {
							users,
							user1,
							user2,
							chatID,
							latestMessage,
							text
						} = doc.data();
						if (doc.data().user1.userID == user && doc.data().latestMessage != null && doc.data().latestMessage != undefined) {
							list.push({
								companyName: user2.name,
								chatID: chatID,
								docID: doc.id,
								latestMessage: latestMessage.toDate(),
								text: text
							});
							setPassedUser(user2.userID)
							console.log(passedUser)
						}

						else if (doc.data().user2.userID == user && doc.data().latestMessage != null && doc.data().latestMessage != undefined) {
							list.push({
								companyName: user1.name,
								chatID: chatID,
								docID: doc.id,
								latestMessage: latestMessage.toDate(),
								text: text
							});
							setPassedUser(user1.userID)
						}
					});
				});
			setChats(list);
			console.log(list)
			console.log(user)
		} catch (e) {
			console.log(e);
		}

	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchChats();
		console.log("hey");
		console.log(refreshing);
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);



	return (
		<SafeAreaView style={styles.container} >

			<View style={{ backgroundColor: "white", height: 90, width: 400, alignItems: "center", justifyContent: "center", position: "absolute", top: 0, borderColor: "white" }}>
				<Text style={{ color: "black", fontSize: 25, marginTop: 30, fontWeight: "bold" }}>Messages</Text>
			</View>


			<SafeAreaView style={styles.container2}>
				<FlatList
					refreshControl={<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="black"
						colors={['transparent']}
						style={{ backgroundColor: "transparent" }}
					/>}
					data={Chats}
					keyExtractor={(item) => item.id}
					extraData={Chats}
					ListFooterComponent={<View style={{ height: 90 }} />}
					renderItem={({ item, separators }) => (
						<Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), navigation.navigate("Chats", { chatID: item.chatID, name: item.companyName, docID: item.docID, userID: passedUser }), console.log("hey") }} >
							<SafeAreaView >
								<View style={styles.chatHolder}>
									<Text style={{ color: "black", fontWeight: "bold", position: "absolute", top: 0, flexDirection: "column" }} >
										<Text style={{ color: "black", fontSize: 25 }}> {item.companyName}  </Text>
									</Text>
									<Text style={{ color: "black", position: "absolute", top: 30, flexDirection: "column" }} >
										<Text style={{ color: "gray", fontSize: 17 }}> {item.text}  </Text>
									</Text>
									<Text style={{ color: "black", position: "absolute", right: 10, top: 10, flexDirection: "column", fontWeight: "bold" }} >
										<Text style={{ color: "black", fontSize: 17 }}> {item.latestMessage.getHours() > 12 || item.latestMessage.getHours() != 0 ? item.latestMessage.getHours() - 12 : item.latestMessage.getHours() < 12 && item.latestMessage.getHours() != 0 ? item.latestMessage.getHours() : "12"}:{item.latestMessage.getMinutes() < 10 ? '0' : ""}{item.latestMessage.getMinutes()} {item.latestMessage.getHours() < 12 ? "AM" : "PM"} </Text>
									</Text>
									<Text style={{ color: "black", position: "absolute", right: 10, top: 30, flexDirection: "column" }} >
										<Text style={{ color: "gray", fontSize: 17 }}> {item.latestMessage.getDay()}/{item.latestMessage.getMonth() < 10 ? '0' : ""}{item.latestMessage.getMonth()}/{item.latestMessage.getYear() - 100}</Text>
									</Text>

								</View>


							</SafeAreaView>
						</Pressable>
					)}
				/>
			</SafeAreaView>
		</SafeAreaView>
	);
};
// {item.latestMessage.getHours() > 12 ? item.latestMessage.getHours() - 12 : ""}:{item.latestMessage.getMinutes() < 10 ? '0' : ""}{item.latestMessage.getMinutes()} 
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
		top: "4.35%",
		// borderWidth: 2
		// shadowColor: "#000",
		// shadowOffset: {
		//     width: 0,
		//     height: 4,
		// },
		// shadowOpacity: 0.30,
		// shadowRadius: 4.65,

		// elevation: 8,
		// borderRadius: 35,

	},

	chatHolder: {
		width: 390,
		height: 70,
		marginBottom: 3,
		backgroundColor: "#ffffff",
		alignContent: "flex-start",
		borderRadius: 2,
		borderBottomWidth: 0.6,
		borderBottomEndRadius: 20,
		borderBottomStartRadius: 20

	},

	tinyLogo: {
		width: 390,
		height: 155,
		position: "absolute",
		borderRadius: 2,
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


});
export default ChatList;