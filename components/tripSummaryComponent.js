import React, { Component } from 'react';
import {View, FlatList, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return { species: state.species }
}

class TripSpecies extends Component {

  static navigationOptions = {
    title: "Found Species"
  }

  

  render() {

    const tripId = this.props.navigation.getParam('tripId');
    const speciesArr = [];
    const speciesFil = this.props.species.species.forEach((s) => {
      s.tripArr.forEach((t) => {
        if (t.tripRef === tripId) {
          if (!speciesArr.includes(s)) {
            speciesArr.push(s);
          }
        }
      });
    });

    const tripSpeciesList = ({item}) => {
      <ListItem title={item.sciName} subtitle={`${item.comName} - Total: ${item.total}`}/>
    }

    const RenderSpecies = (species) => {
      if (species.length === 0) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't found any species yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        )
      } else {
        return <FlatList data={speciesArr} renderItem={tripSpeciesList} keyExtractor={item => item._id.toString()}/>
      }
    }

    return (
      <View style={{flex: 1}}>
        <RenderSpecies species={speciesArr}/>
      </View>
    );
  }
}

export default connect(mapStateToProps)(TripSpecies);