import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	Dimensions,
	AppState,
	KeyboardAvoidingView
} from "react-native";
import CustomInput from "../../Components/CustomInput";
import EmailInput from "../../Components/CustomInput/EmailInput"
import CustomButton from "../../Components/CustomButtons/CustomButton";
import CustomButton2 from "../../Components/CustomButtons/CustomButton2";
import CustomButton3 from "../../Components/CustomButtons/CustomButton3";
import CustomButton4 from "../../Components/CustomButtons/CustomButton4";
import CustomButton5 from "../../Components/CustomButtons/CustomButton5";
import CustomButton6 from "../../Components/CustomButtons/CustomButton6";
import XButton from "../../Components/CustomButtons/XButton"
import SignUpScreen from "../../SignUpScreen";
import { useNavigation, NavigationContainer, useIsFocused } from "@react-navigation/native";
import { auth, sendEmailVerification } from "../../../Firebase";
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import HomeScreenReceiver from "../../Home/HomeScreenReceiver";
import Cart from "../../HomeScreenTabs/Cart";
import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"


const SignInScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { height } = useWindowDimensions();
	const navigation = useNavigation();
	const [modalVisible, setModalVisible] = useState(false);
	const [animateModal, setanimateModal] = useState(true);
	const isFocused = useIsFocused();
	const ref = React.useRef();
	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		if (isFocused && ref.current) {
			ref.current?.play();
			setEmail("");
			setPassword("");
			console.log(1)
		}
		AppState.addEventListener("change", appState => {
			if (appState === "active") {
				ref.current?.play();
				console.log(2)
			}
		});

	}, [isFocused, ref.current]);

	const createTwoButtonAlert = () =>
		Alert.alert(
			"Email Requires Verification",
			"Would you like to re-send an email verification?",
			[
				{
					text: "No.",
					onPress: () => console.log("Canceled"),
					style: "cancel"
				},
				{ text: "Yes.", onPress: () => auth.currentUser.sendEmailVerification }
			]
		);

	const handleSignIn = () => {
		// const userID = auth.currentUser.uid;
		auth
			.signInWithEmailAndPassword(email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				if (user && user.emailVerified) {
					navigation.navigate("HomeProvider")
				}
				else if (user && user.emailVerified === false) {
					alert("Please verify your email!")
				}
			})
			.catch((error) => alert(error.message));
	};

	const onSignInPressed = () => {
		console.log("hello");
	};
	const onForgotPasswordPressed = () => {
		console.warn("Forgot Password");
	};
	const onSignInWithFacebook = () => {
		console.warn("FaceBook Sign In");
	};
	const onSignInWithGoogle = () => {
		console.warn("Google Sign In");
	};
	const onSignInWithApple = () => {
		console.warn("Apple Sign In");
	};
	const OnCreateAnAccount = () => {
		console.warn("Create");
	};

	return (

		<SafeAreaView style={styles.root}>

			<LottieView style={{ flex: 1, marginBottom: 80 }} source={require("../../../assets/lf30_editor_t4cn1heq.json")} autoPlay loop ref={ref} />

			<Text style={{
				fontWeight: "bold",
				color: "black",
				fontSize: 50,
				marginTop: windowHeight * 0.65,
				marginBottom: 0,
				marginRight: 95
			}}>ServeYOU</Text>
			<CustomButton text="Sign In" onPress={() => setModalVisible(true)} />
			<CustomButton text="Sign Up" onPress={() => navigation.navigate("SignUp")} />

			<SwipeUpDownModal
				modalVisible={modalVisible}
				PressToanimate={animateModal}
				ContentModal={
					<View style={{ backgroundColor: "white", width: "100%", height: "100%", marginTop: 20, justifyContent: "center", alignItems: "center" }}>
						<XButton onPress={() => setModalVisible(false)}></XButton>
						<Text style={{ fontSize: 40, fontWeight: "bold", position: "absolute", top: "7%", left: 25 }}>Sign In</Text>

						<KeyboardAvoidingView>
							<EmailInput
								placeholder="Email"
								value={email}
								setValue={setEmail}
								autoCorrect={true}
								autoCapitalize={"none"}
								keyboardType={"email-address"}
							/>

							<CustomInput
								placeholder="Password"
								value={password}
								setValue={setPassword}
								secureTextEntry={true}
								autoCorrect={false}
								autoCapitalize={"none"}
							/>
						</KeyboardAvoidingView>


						<TouchableOpacity style={{ alignItems: "center", width: "25%" }} onPress={() => { handleSignIn(), setModalVisible(false) }}>
							<View style={styles.button}>
								<Ionicons
									name="arrow-forward-circle-outline"
									type="ionicon"
									color="white"
									size="30"
								/>
							</View>
						</TouchableOpacity>

						<Text style={styles.textColor} onPress={onForgotPasswordPressed}>
							Forgot password?
						</Text>

						<CustomButton3
							text="Sign In with Facebook"
							onPress={onSignInWithFacebook}
						/>

						<CustomButton4
							text="Sign In with Google"
							onPress={onSignInWithGoogle}
						/>
						<CustomButton5 text="Sign In with Apple" />
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

	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		alignItems: "center",
		padding: 15,
		width: "100%",
	},

	textColor: {
		marginTop: 20,
		textDecorationLine: 'underline',
		fontWeight: "bold",
		color: "#2c4391"
	},
	textMargin: {
		marginTop: 20,
	},

	text_Logo: {
		fontWeight: "bold",
		color: "black",
		fontSize: 50,
		marginTop: 550,
		marginBottom: 0,
		marginRight: 95
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
		marginTop: "60%",
		borderRadius: 50
	},
	headerContent: {
		marginTop: -30,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	Modal: {
		backgroundColor: 'white',
		marginTop: 225,
	},

	button: {
		width: "100%",
		borderRadius: 15,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
		marginTop: 5,
		backgroundColor: "black",
		shadowRadius: 1,

	}
});

export default SignInScreen;
