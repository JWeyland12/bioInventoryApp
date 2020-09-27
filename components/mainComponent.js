import React, { Component } from "react";
import Projects from "./projectsComponent";
import Inventory from "./inventoryComponent";
import Trip from "./tripComponent";
import Species from './speciesCardComponent';
import Areas from './areaComponent';
import { createStackNavigator } from "react-navigation";
import { View, Platform } from "react-native";

const Navigator = createStackNavigator(
  {
    Projects: { screen: Projects },
    Area: {screen: Areas},
    Inventory: { screen: Inventory },
    Collection: { screen: Trip },
    Info: {screen: Species}
  },
  {
    initialRouteName: "Projects",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#008b8b",
        justifyContent: 'center',
        alignItems: 'center'
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        color: "#FFF",
      },
    },
  }
);

class Main extends Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight }}>
        <Navigator />
      </View>
    );
  }
}

export default Main;
