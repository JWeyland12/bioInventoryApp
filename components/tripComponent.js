import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import { SPECIES, TRIP } from "../shared/inventory";
import { ListItem, Icon, Card } from "react-native-elements";

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      species: SPECIES,
      trip: TRIP,
    };
  }

  static navigationOptions = {
    title: "Collection",
  };

  render() {
    const tripId = this.props.navigation.getParam("tripId");
    const tripFil = this.props.navigation.getParam("tripFil");

    const speciesSelector = () => {
      if (tripId === undefined) {
        const tripArr = tripFil.map((trip) => trip.id);
        const master = this.state.species.filter((species) => tripArr.includes(species.index));
        return master;
      } else if (tripId.toString()) {
        const species = this.state.species.filter((species) => species.index === tripId);
        return species;
      } else {
        const noReturn = null;
        return noReturn;
      }
    };

    const speciesList = ({ item }) => {
      const { navigate } = this.props.navigation;
      return <ListItem title={item.comName} subtitle={`Total: ${item.total}`} leftAvatar={{ source: require("./images/caveSalamander.jpg") }} onPress={() => navigate("Info", { specimen: item })} />;
    };
// CORRECT NO CONTENT CARD
    const RenderContent = ({species}) => {
      if (!species) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't created any inventories yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={speciesSelector()} renderItem={speciesList} keyExtractor={(item) => item.id.toString()} />;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <RenderContent species={this.state.species} tripFil={tripFil}/>
        <TouchableOpacity style={styles.TouchableOpacityStyle}>
          <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },
  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
  textInCard: {
    top: 30,
    fontSize: 20,
    alignContent: "center",
    textAlign: "center",
    color: "dimgray",
  },
  emptyScreenCard: {
    width: "60%",
    height: 250,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 10,
  },
});

export default Trip;
