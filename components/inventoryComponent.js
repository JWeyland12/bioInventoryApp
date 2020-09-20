import React, { Component } from "react";
import { Text, ScrollView, FlatList } from "react-native";
import { Tile, ListItem } from "react-native-elements";
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

    const renderList = ({ item }) => {
      return <ListItem title={`Inventory Date: ${item.date}`} featured leftAvatar={{source: require("./images/neversinkPit.jpg")}} />;
    };

    const InventoryList = ({trip}) => {
      {console.log('trip' + trip)}
      return <FlatList data={trip} renderItem={renderList} keyExtractor={(item) => item.id.toString()} />;
    };

    const InventoryMaster = ({project}) => {
      {console.log('project' + project.name)}
      if (project) {
        return <ListItem title={`${project.name} Master List`} featured leftAvatar={{source: require("./images/stephensGap.jpg")}} />;
      }
      return <View />;
    };

    return (
      <ScrollView>
        {console.log(tripFil)}
        <InventoryMaster projectId={projectId} project={project} master={this.state.master} />
        <InventoryList project={project} trip={tripFil} projectId={projectId} />
      </ScrollView>
    );
  }
}

export default Inventory;
