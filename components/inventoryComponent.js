import React, { Component } from "react";
import { Text, ScrollView, FlatList } from "react-native";
import { Tile } from "react-native-elements";
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
    const project = this.state.projectsList.filter((project) => project.id === projectId);
    const tripFil = this.state.trip.filter((trip) => trip.index === projectId);

    const renderList = ({ item }) => {
      return <Tile title={item.date} featured imageSrc={require("./images/neversinkPit.jpg")} />;
    };

    const InventoryList = ({trip}) => {
      {console.log('trip' + trip)}
      return <FlatList data={trip} renderItem={renderList} keyExtractor={(item) => item.id.toString()} />;
    };

    const InventoryMaster = ({project}) => {
      if (project) {
        return <Tile title={project.name} featured imageSrc={require("./images/stephensGap.jpg")} />;
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
