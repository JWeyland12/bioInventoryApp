import React, { Component } from "react";
import { ScrollView, FlatList } from "react-native";
import { SPECIES, TRIP } from "../shared/inventory";
import { ListItem } from "react-native-elements";

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
      <ScrollView>
        {console.log(`tripId: ${tripId}`)}
        {/* {console.log(`tripInded: ${}`)} */}
        <FlatList data={speciesSelector()} renderItem={speciesList} keyExtractor={(item) => item.id.toString()} />
      </ScrollView>
    );
  }
}

export default Trip;
