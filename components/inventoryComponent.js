import React, { Component } from "react";
import { ScrollView, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import { PROJECTSLIST } from "../shared/projects";
import { MASTER, TRIP, SPECIES } from "../shared/inventory";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsList: PROJECTSLIST,
      master: MASTER,
      trip: TRIP,
      species: SPECIES,
    };
  }

  static navigationOptions = {
    title: "Inventory",
  };
  
  render() {
    const projectId = this.props.navigation.getParam("projectId");
    const project = this.state.projectsList.filter((project) => project.id === projectId)[0];
    const tripFil = this.state.trip.filter((trip) => trip.index === projectId);
    const {navigate} = this.props.navigation;

    const renderList = ({ item }) => {
      return <ListItem title={`Inventory Date: ${item.date}`} featured leftAvatar={{source: require("./images/neversinkPit.jpg")}}
        onPress={() => navigate('Collection', {tripId: item.id, tripIndex: item.index, projectId: projectId})}/>;
    };

    const InventoryList = ({trip}) => {
      return <FlatList data={trip} renderItem={renderList} keyExtractor={(item) => item.id.toString()} />;
    };

    const InventoryMaster = ({project}) => {
      if (project) {
        return <ListItem title={`${project.name} Master List`} featured leftAvatar={{source: require("./images/stephensGap.jpg")}} 
          onPress={() => navigate('Collection', {projectId: projectId, tripFil: tripFil})}
        />;
      }
      return <View />;
    };

    return (
      <ScrollView>
        {console.log(this.state.index)}
        <InventoryMaster projectId={projectId} project={project} />
        <InventoryList trip={tripFil} projectId={projectId} />
      </ScrollView>
    );
  }
}

export default Inventory;
