import React, { useState, useContext, useEffect } from "react";
import Projects from "./projectsComponent";
import Trips from "./tripComponent";
import Areas from "./areaComponent";
import AreaSummary from './areaSummaryComponent';
import AreaInformation from './areaInformationComponent';
import SpeciesInfo from './speciesInfoComponent';
import CreateProject from './createProjectComponent';
import CreateArea from './createAreaComponent';
import CreateSpecies from "./createSpeciesComponent";
import CreateTripSpecies from './createTripSpeciesComponent';
import TripSpecies from './tripSummaryComponent';
import TripInfo from './tripInfoComponent';
import SpeciesList from './speciesComponent';
import SignIn from './signInComponent';
import SignUp from './signUpComponent';
import Profile from './profileComponent';
import Search from './searchComponent';
import MasterSpeciesInfo from './masterSpeciesInfoComponent';
import ProjectSummary from './projectSummaryComponent';
import ProjectInfo from './projectInfoComponent';
import { createStackNavigator, createBottomTabNavigator, createNavigationContainer } from "react-navigation";
import { View, Platform, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { fetchProjects } from "../redux/actionCreators/projects";
import {fetchAreas} from '../redux/actionCreators/areas';
import { fetchTrips } from '../redux/actionCreators/trips';
import { fetchSpecies } from '../redux/actionCreators/species';
import {Icon, Button} from 'react-native-elements';
import {UserContext} from './userContextComponent';

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
    CreateTripSpecies: {screen: CreateTripSpecies},
    CreateSpecies: {screen: CreateSpecies},
    Search: {screen: Search},
    AreaInformation: {screen: AreaInformation},
    SpeciesInfo: {screen: SpeciesInfo},
    ProjectSummary: {screen: ProjectSummary},
    ProjectInfo: {screen: ProjectInfo},
    TripInfo: {screen: TripInfo}
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
      headerRight: <Icon
        name='search'
        type='font-awesome'
        iconStyle={{margin: 20, color: 'white'}}
        onPress={() => {}}
        />,
    },
  }
);

const SpeciesTab = createStackNavigator(
  {
    SpeciesList: {screen: SpeciesList},
    CreateSpecies: {screen: CreateSpecies},
    MasterSpeciesInfo: {screen: MasterSpeciesInfo}
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#008b8b"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        color: '#FFF'
      },
      headerRight: <Icon
        name='search'
        type='font-awesome'
        iconStyle={{margin: 20, color: 'white'}}
        onPress={() => {}}
        />
    }
  }
)

const UsersTab = createStackNavigator(
  {
    Profile: {screen: Profile},
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#008b8b'
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        color: '#FFF'
      }
    }
  }
)

const Auth = new createStackNavigator({
  SignIn: {screen: SignIn},
  SignUp: {screen: SignUp}
},
{
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#008b8b'
    },
    headerTintColor: '#000',
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
  ScreenThree: {
    screen: UsersTab,
    navigationOptions: {
      tabBarLabel: 'Account',
      tabBarIcon: () => (
        <Icon name="user-o" type='font-awesome'/>
      ),
      tabBarOptions: {
        activeTintColor: '#008b8b'
      }
    }
  }
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
    },
  }
})

const mapStateToProps = state => {
  return {user: state.user}
}

const Main = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const {value} = useContext(UserContext)
  const [user, setUser] = value

  console.log('user', user)

useEffect(() => {
  if(props.user.token) {
    props.fetchProjects(props.user.token);
    props.fetchAreas(props.user.token);
    props.fetchTrips(props.user.token);
    props.fetchSpecies(props.user.token);
    setUser(props.user)
    setIsLoggedIn(true)
  } else {
    setIsLoggedIn(false)
  }
}, [props.user.user])



console.log('isLoggedIn', isLoggedIn)

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight }}>
      {!isLoggedIn ? <Auth /> : <MyTabs />}
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

