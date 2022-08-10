import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TabBarIOSItem,
	RefreshControl,
	Dimensions
} from "react-native";
import CustomButton from "../Components/CustomButtons/CustomButton";
import Search from "../HomeScreenTabs/Search";
import UserSettings from "../HomeScreenTabs/UserSettings";
import InputAdder from "../HomeScreenTabs/InputAdder";
import ServicesReceiver from "../HomeScreenTabs/ServicesReceiver";
import UserSelect from "../UserSelectionScreen/UserSelect";
import Map from "../HomeScreenTabs/Map"
import ChatList from "../HomeScreenTabs/ChatList"
import Cart from "../HomeScreenTabs/Cart"
import Icon from 'react-native-vector-icons/Ionicons';
import OrdersQuotesReceiver from '../HomeScreenTabs/OrdersQuotesReceiver';
import { useNavigation, NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { auth } from "../../Firebase";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import GetLocation from 'react-native-get-location'
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


const HomeScreenReceiver = () => {
	const Tab = createMaterialBottomTabNavigator();
	const screenHeight = Dimensions.get("screen").height;
	const screenWidth = Dimensions.get("screen").width;

	console.log(global.cartItemCounter)

	useEffect(() => {
		console.log("working")
		fetchCart();
	}, [global.cartItemCounter]);

	const fetchCart = async () => {
		console.log("receiver fetchcart called")
		try {
			let cartCounter = 0;
			const list = [];
			const db = firebase.firestore();
			await db
				.collection('Cart')
				.orderBy("companyName")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						if (doc.data().user == auth.currentUser.uid) {
							cartCounter += 1;
						}
					});
				});
			global.cartItemCounter = cartCounter;
		} catch (e) {
			console.log(e);
		}

	};

	return (

		<Tab.Navigator
			initialRouteName="ServicesReceiver"
			activeColor="black"
			shifting="true"
			barStyle={{
				backgroundColor: 'rgba(255, 255, 255, 0.8)',
				position: "absolute",
				bottom: screenHeight * 0,
				right: 0,
				left: 0,
				alignContent: "center",
				height: screenHeight * 0.08,
			}}
		>

			<Tab.Screen
				options={{
					tabBarLabel: "Home",
					headerShown: true,
					tabBarActiveBackgroundColor: "black",

					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='home'
							type="ionicon"
							color='black'
							size="27"
						/>
					),
				}}
				name="My Services"
				component={ServicesReceiver}
			/>

			{/* <Tab.Screen
				options={{
					tabBarLabel: "Discover",
					headerShown: true,
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='search'
							type="ionicon"
							color='black'
							size="25"
						/>
					),
				}}
				name="Search"
				component={Search}
			/> */}

			<Tab.Screen
				options={{
					headerShown: true,
					tabBarActiveBackgroundColor: "#02a0b5",
					tabBarBadge: cartItemCounter > 0 ? cartItemCounter : null,
					tabBarIcon: () => (
						<Ionicons
							name='cart'
							type="ionicon"
							color='black'
							size="26"
						/>
					),
				}}
				name="Cart"
				component={Cart}
			/>


			<Tab.Screen
				options={{
					tabBarLabel: "My Orders",
					headerShown: true,
					tabBarActiveBackgroundColor: "black",

					tabBarIcon: () => (
						<Ionicons
							name='pricetags'
							type="ionicon"
							color='black'
							size="23"
						/>
					),
				}}
				name="OrdersReceiver"
				component={OrdersQuotesReceiver}
			/>


			<Tab.Screen
				options={{
					tabBarLabel: "Messages",
					headerShown: true,
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="chatbubble-ellipses"
							type="ionicon"
							color='black'
							size="25"
						/>
					),
				}}
				name="Chat"
				component={ChatList}
			/>

			<Tab.Screen
				options={{
					headerShown: true,
					tabBarActiveBackgroundColor: "#02a0b5",

					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='person'
							type="ionicon"
							color='black'
							size='28'
						/>
					),
				}}
				name="Settings"
				component={UserSettings}
			/>
		</Tab.Navigator>

	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	userName: {
		textAlign: "right",
		alignContent: "flex-end",
		marginLeft: 0,
	},
	blurView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	bottomTabBar: {
		// backgroundColor: 'transparent',
	},
});

export default HomeScreenReceiver;
