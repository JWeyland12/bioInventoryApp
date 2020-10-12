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
    const species = this.props.species.species;
    const speciesArr = [];

    const speciesFil = species.forEach((s) => {
      s.tripArr.forEach((t) => {
        if (t.areaRef === areaId) {
          if (!speciesArr.includes(s)) {
            speciesArr.push(s);
          }
        }
      });
    });

    const speciesTotal = (speciesArr) =>
      speciesArr.forEach((s) => {
        const totalArr = s.tripArr.map((r) => {
          if (r.areaRef === areaId) {
            return r.total;
          }
        });
        const total = totalArr.reduce((a, b) => {
          return a + b;
        }, 0);
        s.total = total;
      });

    speciesTotal(speciesArr);

    const speciesList = ({ item }) => {
      // add species photo
      return <ListItem title={item.sciName} subtitle={`${item.comName} - Total: ${item.total}`}/>;
    };

    const RenderSpecies = ({ speciesArr }) => {
      if (speciesArr.length === 0) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't found any species in this area yet!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={speciesArr} renderItem={speciesList} keyExtractor={(item) => item._id.toString()} />;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <ListItem title={'Geo-reference'} subtitle={'84.428000, -111.548000'}/>
        <RenderSpecies speciesArr={speciesArr} />
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

// const speciesFil = species.forEach((s) => {
//   trips.forEach((trip) => {
//     s.tripArr.forEach((t) => {
//       if (t.tripRef === trip._id) {
//         if (!speciesArr.includes(s)) {
//           speciesArr.push(s);
//         }
//       }
//     });
//   });
// });
