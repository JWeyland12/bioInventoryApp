import React, { Component } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { ListItem, Card } from "react-native-elements";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    trips: state.trips,
    species: state.species,
  };
};

class AreaSummary extends Component {
  static navigationOptions = {
    title: "Area Summary",
  };

  render() {
    const areaId = this.props.navigation.getParam("areaId");
    const trips = this.props.trips.trips.filter((trips) => trips.areaId === areaId);
    // const species = this.props.species.species.map((species) => {
    //   console.log("you are here");
    //   console.log(`filtered trips: ${trips.length}`)
    //   for (const id of trips) {
    //     console.log("enter first for loop");
    //     console.log(`tripArr._id: ${species.tripArr.length}`)
    //     if (species.tripArr.length !== 0){
    //       console.log('entered second if block')
    //       console.log(`species.tripArr._id: ${toString(species.tripArr._id)}`)
    //       if(id === species.tripArr._id) {
    //         return species
    //       }
    //     }
        
    //   }
    // });

    const species = this.props.species.species.filter(species => {
      for (let i = trips.length - 1; i <= 0; i--) {
        species.tripArr._id === trips[i]._id
      }
    })

    const speciesList = ({ item }) => {
      // add species photo
      return <ListItem title={item.comName} subtitle={item.sciName} />;
    };

    const RenderSpecies = ({ species }) => {
      if (species.length === 0) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't found any species in this area yet!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={species} renderItem={speciesList} keyExtractor={(item) => item._id.toString()} />;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        {console.log(`filtered species: ${species}`)}
        <RenderSpecies species={species} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInCard: {
    top: 30,
    fontSize: 20,
    alignContent: "center",
    textAlign: "center",
    color: "dimgray",
  },
  emptyScreenCard: {
    width: "60%",
    height: 150,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 10,
  },
});

export default connect(mapStateToProps)(AreaSummary);
