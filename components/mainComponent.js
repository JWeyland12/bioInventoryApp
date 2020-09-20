import React, { Component } from "react";
import Projects from "./projectsComponent";
import Inventory from "./inventoryComponent";
import { createStackNavigator } from "react-navigation";
import { View, Platform } from "react-native";

const Navigator = createStackNavigator(
  {
    Projects: { screen: Projects },
    Inventory: { screen: Inventory },
  },
  {
    initialRouteName: "Projects",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#00ced1",
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        color: '#000'
      }
    },
  }
);

class Main extends Component {

  render() {
    return (
      <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
        <Navigator />
      </View>
    );
  }
}

export default Main;
