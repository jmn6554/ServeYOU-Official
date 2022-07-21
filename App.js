import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
	Button,
	StyleSheet,
	Text,
	View,
	TextInput,
	SafeAreaView,
	Platform,
	SafeAreaViewComponent,
	ScrollView,
} from "react-native";
import SignInScreen from "./src/Screens/SignInScreen/SignInScreen";
import SignUpScreen from "./src/SignUpScreen";
import HomeScreenProvider from "./src/Home/HomeScreenProvider";
import HomeScreenReceiver from "./src/Home/HomeScreenReceiver"
import UserSelect from "./src/UserSelectionScreen/UserSelect";
import ServiceProvider from "./src/UserSelectionScreen/ServiceProvider"
import ServiceReceiver from "./src/UserSelectionScreen/ServiceReceiver"
import EmailVerification from "./src/EmailVerificationScreen/EmailVerification";
import ServicePage from "./src/HomeScreenTabs/ServicePage"
import Chat from "./src/Chat/Chat"
import Agenda from "./src/HomeScreenTabs/Agenda";
import Options from "./src/HomeScreenTabs/Options"
import ServicesAdditional from "./src/HomeScreenTabs/ServicesAdditional"
import {
	useNavigation,
	NavigationContainer,
	DefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import Config from "react-native-config"
import { CardField, useStripe, StripeProvider, initStripe } from '@stripe/stripe-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuoteView from "./src/HomeScreenTabs/QuoteView";


const Stack = createStackNavigator();
const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		// background: "#051938",
		background: "white",
		//#cad0d9
	},
};
console.log(Config.REACT_APP_PASSWORD)



const App = () => {
	const [stripeKey, setStripeKey] = useState("");
	global.cartCount = 0;
	global.cartItemCounter = 0;
	global.initializationVariable = 0;


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
			console.log(stripeKey)

		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchStripeKey();
	}, []);



	return (
		<StripeProvider
			publishableKey={stripeKey}
			merchantIdentifier="merchant.identifier">

			<NavigationContainer theme={MyTheme}>
				<StatusBar style="dark" />
				<Stack.Navigator>
					<Stack.Screen
						style={styles.container}
						options={{ headerShown: false }}
						name="SignIn"
						component={SignInScreen}
					/>
					<Stack.Screen
						options={{
							headerTransparent: true,
							headerTitle: " ",
							headerBackTitle: false,
							headerTintColor: "black",
						}}
						name="SignUp"
						component={SignUpScreen}
					/>
					<Stack.Screen
						options={{
							headerShown: false,
							gestureEnabled: false,
						}}
						name="VerifyEmail"
						component={EmailVerification}
					/>
					<Stack.Screen
						name="HomeProvider"
						component={HomeScreenProvider}
						options={{
							headerShown: false,
							headerLeft: null,
							gestureEnabled: false,
							headerTintColor: "white",
							headerStyle: {
								backgroundColor: "#2c4391",
							},
						}}

					/>

					<Stack.Screen
						name="HomeReceiver"
						component={HomeScreenReceiver}
						options={{
							headerShown: false,
							headerLeft: null,
							gestureEnabled: false,
							headerTintColor: "white",
							headerStyle: {
								backgroundColor: "#2c4391",
							},
						}}

					/>
					<Stack.Screen options={{
						headerShown: false,
						gestureEnabled: false,
					}}
						name="UserSelect"
						component={UserSelect} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: " ",
						headerBackTitle: false,
						headerTintColor: "white",
					}}
						name="ServiceProvider"
						component={ServiceProvider} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: " ",
						headerBackTitle: false,
						headerTintColor: "black",
					}}
						name="QuoteView"
						component={QuoteView} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: " ",
						headerBackTitle: false,
						headerTintColor: "white",
					}}
						name="ServiceReceiver"
						component={ServiceReceiver} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: "",
						headerBackTitle: false,
						headerTintColor: "black",
					}}
						name="ServicePage"
						component={ServicePage} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: "",
						headerBackTitle: false,
						headerTintColor: "black",
					}}
						name="ServicesAdditional"
						component={ServicesAdditional} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: "",
						headerBackTitle: true,
						headerTintColor: "black",
					}}
						name="Chats"
						component={Chat} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: " ",
						headerBackTitle: false,
						headerTintColor: "black",
					}}
						name="Agenda"
						component={Agenda} />

					<Stack.Screen options={{
						headerTransparent: true,
						headerTitle: " ",
						headerBackTitle: false,
						headerTintColor: "black",
					}}
						name="Options"
						component={Options} />


				</Stack.Navigator>
			</NavigationContainer>
		</StripeProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#FAFAFA",
		paddingTop: StatusBar.currentHeight,
	},
});
export default App;