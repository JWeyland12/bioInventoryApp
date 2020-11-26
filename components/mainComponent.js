import React, { Component } from "react";
import Projects from "./projectsComponent";
import Trips from "./tripComponent";
import Species from "./speciesCardComponent";
import Areas from "./areaComponent";
import AreaSummary from './areaSummaryComponent';
import CreateProject from './createProjectComponent';
import CreateArea from './createAreaComponent';
import CreateSpecies from "./createSpeciesComponent";
import TripSpecies from './tripSummaryComponent';
import SpeciesList from './speciesComponent';
import { createStackNavigator, createBottomTabNavigator, createNavigationContainer } from "react-navigation";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import { fetchProjects } from "../redux/actionCreators/projects";
import {fetchAreas} from '../redux/actionCreators/areas';
import { fetchTrips } from '../redux/actionCreators/trips';
import { fetchSpecies } from '../redux/actionCreators/species';
import {Icon, Button} from 'react-native-elements';

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
    CreateProject: {screen: CreateProject},
    CreateArea: {screen: CreateArea},
    TripSpecies: {screen: TripSpecies},
    SpeciesList: {screen: SpeciesList},
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

const SpeciesTab = createStackNavigator(
  {
    SpeciesList: {screen: SpeciesList},
    CreateSpecies: {screen: CreateSpecies}
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#008b8b"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        color: '#FFF'
      }
    }
  }
)

const MyTabs = new createBottomTabNavigator({
  
  ScreenOne: {
    screen: SpeciesTab,
    navigationOptions: {
      tabBarLabel: 'Species',
      tabBarIcon: () => (
        <Icon name='list' type='font-awesome'/>
      ),
      tabBarOptions: {
        activeTintColor: '#008b8b'
      },
    }
  },
  ScreenTwo: {
    screen: Navigator,
    navigationOptions: {
      tabBarLabel: 'Projects',
      tabBarIcon: () => (
        <Icon name='th-large' type='font-awesome'/>
      ),
      tabBarOptions: {
        activeTintColor: "#008b8b"
      },
    }
  },
},
{
  initialRouteName: 'ScreenTwo',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#008b8b'
    },
    headerTintColor: '#000',
    headerTitleStyle: {
      color: '#FFF'
    }
  }
})

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
        <MyTabs />
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(Main);
