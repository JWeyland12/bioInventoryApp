import React, { Component } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { ListItem, Card, Icon } from "react-native-elements";
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
    let speciesArr = [];

    const speciesFil = species.forEach((s) => {
      s.tripArr.forEach((t) => {
        if (t.areaId === areaId) {
          if (!speciesArr.includes(s)) {
            speciesArr.push(s);
          }
        }
      });
    });

    speciesArr = speciesArr.sort((a, b) => (a.comName > b.comName) ? 1 : -1)


    const speciesList = ({ item }) => {
      // add species photo
      const totalCount = item => {
        const totalsArr = []
        for (let i = 0; i <= item.tripArr.length - 1; i++) {
          if (item.tripArr[i].areaId === areaId) {
            totalsArr.push(item.tripArr[i].total)
          }
        }
        const total = totalsArr.reduce((a, b) => {
          return a + b;
        }, 0)
        return total
      }
      return <ListItem 
              title={item.comName} 
              subtitle={`${item.sciName} - Area Total: ${totalCount(item)}`}
              topDivider
              bottomDivider
              leftAvatar={{source: {uri: item.img}, size: 'large'}}
              rightIcon={<Icon name='angle-right' type='font-awesome'/>}
            />;
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

    const areaGeoRef = this.props.navigation.getParam('areaGeoRef')
    return (
      <View style={{ flex: 1 }}>
        <ListItem title={'Geo-reference'} subtitle={areaGeoRef} rightIcon={<Icon name='angle-right' type='font-awesome'/>} containerStyle={{height: 100}}/>
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
