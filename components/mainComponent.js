import React, { Component } from "react";
import Projects from "./projectsComponent";
import Inventory from "./inventoryComponent";
import Trips from "./tripComponent";
import Species from "./speciesCardComponent";
import Areas from "./areaComponent";
import AreaSummary from './areaSummaryComponent';
import { createStackNavigator } from "react-navigation";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import { fetchProjects } from "../redux/actionCreators/projects";
import {fetchAreas} from '../redux/actionCreators/areas';
import { fetchTrips } from '../redux/actionCreators/trips';
import { fetchSpecies } from '../redux/actionCreators/species';

const mapDispatchToProps = {
  fetchProjects,
  fetchAreas,
  fetchTrips,
  fetchSpecies
}

const Navigator = createStackNavigator(
  {
    Projects: { screen: Projects },
    Areas: { screen: Areas },
    Trips: {screen: Trips},
    AreaSummary: {screen: AreaSummary},
    // Inventory: { screen: Inventory },
    // Collection: { screen: Trip },
    // Info: { screen: Species },
  },
  {
    initialRouteName: "Projects",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#008b8b",
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        color: "#FFF",
      },
    },
  }
);

class Main extends Component {

componentDidMount() {
  this.props.fetchProjects();
  this.props.fetchAreas();
  this.props.fetchTrips();
  this.props.fetchSpecies();
}

  render() {
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight }}>
        <Navigator />
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(Main);
