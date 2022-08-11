import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TabBarIOSItem,
	Dimensions
} from "react-native";
import CustomButton from "../Components/CustomButtons/CustomButton";
import Search from "../HomeScreenTabs/Search";
import UserSettings from "../HomeScreenTabs/UserSettings";
import InputAdder from "../HomeScreenTabs/InputAdder";
import Services from "../HomeScreenTabs/Services";
import Map from "../HomeScreenTabs/Map"
import ChatList from "../HomeScreenTabs/ChatList";
import OrdersQuotesProviders from "../HomeScreenTabs/OrdersQuotesProvider"
import { Icon } from "react-native-elements";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { auth } from "../../Firebase";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import GetLocation from 'react-native-get-location'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ionicons from "ionicons"


const HomeScreen = () => {
	const navigation = useNavigation();
	const [search, setSearch] = useState("");
	const [location, setLocation] = useState("");
	const screenHeight = Dimensions.get("screen").height;
	const screenWidth = Dimensions.get("screen").width;

	const updateSearch = (search) => {
		setSearch(search);
	};

	const handleSignOut = () => {
		auth
			.signOut()
			.then(() => {
				navigation.replace("SignIn");
			})

			.catch((error) => alert(error.message));
	};

	const Tab = createMaterialBottomTabNavigator();
	const Stack = createStackNavigator();


	return (

		<Tab.Navigator
			initialRouteName="Home"
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

			{/* <Tab.Screen
        options={{
          tabBarLabel: "Search",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='home'
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
					tabBarLabel: "My Services",
					headerShown: true,
					tabBarActiveBackgroundColor: "#02a0b5",

					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='layers'
							type="ionicon"
							color='black'
							size="25"
						/>
					),
				}}
				name="My Services"
				component={Services}
			/>
			<Tab.Screen
				options={{
					tabBarLabel: "Orders",
					headerShown: true,
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="pricetags"
							type="ionicon"
							color='black'
							size="25"
						/>
					),
				}}
				name="OrdersQuotesProviders"
				component={OrdersQuotesProviders}
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
							name='map'
							type="ionicon"
							color='black'
							size="25"
						/>
					),
				}}
				name="Map"
				component={Map}
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
							size='25'
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
		backgroundColor: 'transparent',
	},
});

export default HomeScreen;
