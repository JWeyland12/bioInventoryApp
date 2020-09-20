import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SPECIES, TRIP } from "../shared/inventory";
import { ListItem, Icon } from "react-native-elements";

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      species: SPECIES,
      trip: TRIP
    };
  }

  static navigationOptions = {
    title: "Collection",
  };

  render() {
    const tripId = this.props.navigation.getParam("tripId");
    const tripFil = this.props.navigation.getParam('tripFil')

    const speciesSelector = () => {
      if (tripId === undefined) {
        const tripArr = tripFil.map(trip => trip.id)
        return this.state.species.filter(species => tripArr.includes(species.index))
      } else if (tripId.toString()) {
        return this.state.species.filter((species) => species.index === tripId);
      }
    };

    const speciesList = ({ item }) => {
      const {navigate} = this.props.navigation;
      return <ListItem title={item.comName} subtitle={`Total: ${item.total}`} leftAvatar={{ source: require("./images/caveSalamander.jpg") }} onPress={() => navigate('Info', {specimen: item})} />;
    };
    return (
      <View style={{flex: 1}}>
        <FlatList data={speciesSelector()} renderItem={speciesList} keyExtractor={(item) => item.id.toString()} />
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
});

export default Trip;
