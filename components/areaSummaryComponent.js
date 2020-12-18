import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { ListItem, Card, Icon } from "react-native-elements";

const AreaSummary = props => {
  const [areaId, setAreaId] = useState(props.navigation.getParam("areaId"))
  const [species, setSpecies] = useState();
  const [isSpecies, setIsSpecies] = useState(false)

  useEffect(() => {
    if (!species) {
      setSpecies(props.navigation.getParam('species'))
      setAreaId(props.navigation.getParam('areaId'))
    }
    if (species) {
      setIsSpecies(true)
    }
  })

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
            subtitle={`${item.sciName} - Area total: ${totalCount(item)}`}
            topDivider
            bottomDivider
            leftAvatar={{source: {uri: item.img}, size: 'large'}}
          />;
  };

  const RenderSpecies = () => {
    return (
      <View>
      {!isSpecies ? 
      (<View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
          <Text style={styles.textInCard}>You haven't found any species in this area yet!</Text>
        </Card>
      </View>) :
      (<FlatList data={species} renderItem={speciesList} keyExtractor={(item) => item._id.toString()} />)}
    </View>
    )
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <RenderSpecies />
    </View>
  );
}

AreaSummary.navigationOptions = {
  title: 'Species List'
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

export default AreaSummary;

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
