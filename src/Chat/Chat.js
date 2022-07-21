import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert, Keyboard, autoFocus, Dimensions, Text } from "react-native";
import customInputToolbar from "../Components/CustomInput/customInputToolbar"
import ImageSelect from "../Components/CustomButtons/ImageSelect"
import firebase from "firebase/compat/app";
import { auth, sendEmailVerification, query, collection, collectionRef, database, where, snapshot } from "../../Firebase";
// import { doc, DocumentSnapshot, onSnapshot } from "firebase/firestore";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import GetLocation from 'react-native-get-location'
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as ImagePicker from 'expo-image-picker'
import * as geolib from 'geolib';
import * as Location from 'expo-location';
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation, NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { GiftedChat, InputToolbar, Bubble, Send, Composer } from 'react-native-gifted-chat';
import { TypingAnimation } from "react-native-typing-animation";
import { set } from 'react-native-reanimated';
// import { set } from 'react-native-reanimated';
// import { subscribeToLocationUpdates } from 'react-native-location';

const Chat = ({ route }) => {
	var [messages, setMessages] = useState("");
	// const chatID = route.params.chatIDs;
	const [intervals, setIntervals] = useState(true)
	var timesrun = 0;
	var [chatID, setChatID] = useState(""); //chatID
	var [docID, setDocID] = useState("");
	const [params, setParams] = useState("")
	const [run, setRun] = useState(true)
	const [Fetch, setFetch] = useState("")

	// useEffect(() => {
	//     const myInterval = setInterval(() => {
	//         setFetch(!Fetch)
	//         timesrun += 1;

	//         if (timesrun < 1) {
	//             console.log("hey")
	//             // setCurrentAddress(Location.getCurrentPositionAsync({}));
	//             // console.log(currentAddress)
	//         }
	//         else if (timesrun > 1) {
	//             // fetchServices();
	//             clearInterval(myInterval);
	//             // console.log(currentAddress)
	//         }

	//     }, 500)
	// }, [intervals]);

	console.log(route.params)

	useEffect(() => {
		const db = firebase.firestore();
		const unsubscribe = db
			.collection('Messages')
			.where("chatID", "==", route.params.chatID) // route.params.chatID
			.orderBy("createdAt", "desc")
			.onSnapshot("Messages", querySnapshot => {
				setMessages(
					querySnapshot.docs.map(doc => ({
						_id: doc.data()._id,
						createdAt: doc.data().createdAt.toDate(),
						text: doc.data().text,
						user: doc.data().user
					}))
				);
			});

		return () => unsubscribe();
	}, []);

	// useEffect(() => {
	//     const getDoc = async () => {
	//         console.log("ran")
	//         try {
	//             const list = [];
	//             const user = auth.currentUser.uid;
	//             const db = firebase.firestore();
	//             await db
	//                 .collection('ChatRooms')
	//                 .get()
	//                 .then((querySnapshot) => {
	//                     querySnapshot.forEach((doc) => {
	//                         if (doc.data().users.includes(route.params.userID) && doc.data().users.includes(user)) {
	//                             list.push({
	//                                 docID: doc.id,
	//                                 chatID: doc.data().chatID
	//                             })
	//                             console.log("hey")
	//                             setRun(false)
	//                         }
	//                         else {
	//                         }
	//                     });
	//                 });
	//             console.log(params[0].chatID)
	//             return setParams(list);
	//         } catch (e) {
	//             console.log(e);
	//         }
	//     };
	//     getDoc();
	// }, [Fetch]);


	const updateLatestMessage = (latest, text) => {
		const db = firebase.firestore();
		db
			.collection('ChatRooms')
			.doc(route.params.docID) //route.params.docID
			.update({
				latestMessage: latest,
				text: text
			})
	}
	// console.log("this is the docID:" + route.params.docID)

	const onSend = useCallback((messages = []) => {
		const db = firebase.firestore();
		const user = auth.currentUser.uid;
		db.collection("Messages").add({
			text: messages[0].text,
			_id: messages[0]._id,
			createdAt: messages[0].createdAt,
			userID: user,
			user: messages[0].user,
			chatID: route.params.chatID,
		})

		setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
		updateLatestMessage(messages[0].createdAt, messages[0].text);
	}, [])


	return (
		<View style={{flex:1}}>
		<View style={{width: Dimensions.get("window").width, height:Dimensions.get("window").height * 0.07, backgroundColor:"white", alignItems:"center", marginTop: Dimensions.get("window").height * 0.075}}>
			<Text style={{fontSize:25, fontWeight:"600"}}>{route.params.name}</Text>
			</View>

		<GiftedChat
			messages={messages}
			onSend={messages => onSend(messages)}
			// isTyping={typing}
			// onInputTextChanged={typingHandler}
			alwaysShowSend="true"
			user={{
				_id: auth.currentUser.uid,
			}}
			containerStyle={{
				backgroundColor: "white",
				borderTopColor: "#E8E8E8",
				borderBottomColor: "#E8E8E8",
				borderTopWidth: 0.5,
				borderBottomWidth: 0.5,
				borderRadius: 15,
			}}

			renderBubble={props => {
				return (
					<Bubble
						{...props}

						wrapperStyle={{
							left: {
								backgroundColor: '#c3cee0',
							},
							right: {
								backgroundColor: "black",
							},
						}}
					/>

				);
			}}

			renderSend={props => {
				return (
					<View >
						<Send
							{...props}
							textStyle={{ color: "black" }} label={'Send'}>
						</Send>
					</View>
				);
			}}

		// renderComposer={props => {
		//     return (
		//         <SafeAreaView>
		//             <Composer {...props} placeholder={'Message...'} />
		//             <ImageSelect />
		//         </SafeAreaView>
		//     );
		// }}

		/>
		</View>


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
		width: "100%",
		height: "100%",
		position: "absolute",

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
		marginTop: "25%",
		margin: 0,
		borderRadius: 70,
		backgroundColor: "#2c4391",
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
		borderRadius: 70,
		backgroundColor: "#2c4391",
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
		height: 250,
		marginBottom: 3,
		backgroundColor: "#ffffff",
		alignContent: "flex-start",
		borderRadius: 2,

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
export default Chat;