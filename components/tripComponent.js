import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import { ListItem, Icon, Card } from "react-native-elements";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { trips: state.trips };
};

class Trips extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "Trips",
  };

  render() {
    const areaId = this.props.navigation.getParam("areaId");
    const trips = this.props.trips.trips.filter((trips) => trips.areaId === areaId);

    // const speciesSelector = () => {
    //   if (tripId === undefined) {
    //     const tripArr = tripFil.map((trip) => trip.id);
    //     const master = this.state.species.filter((species) => tripArr.includes(species.index));
    //     return master;
    //   } else if (tripId.toString()) {
    //     const species = this.state.species.filter((species) => species.index === tripId);
    //     return species;
    //   } else {
    //     const noReturn = null;
    //     return noReturn;
    //   }
    // };

    const tripList = ({ item }) => {
      const { navigate } = this.props.navigation;
      return <ListItem title={item.date} onPress={() => navigate("Inventory", { tripId: item._id })} />;
    };
    // CORRECT NO CONTENT CARD
    const RenderTrips = ({ trips }) => {
      if (trips.length === 0) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't created any trips yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={trips} renderItem={tripList} keyExtractor={(item) => item._id.toString()} />;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <RenderTrips trips={trips} />
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

export default connect(mapStateToProps)(Trips);
