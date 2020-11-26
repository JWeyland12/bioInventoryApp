import React, { Component } from 'react';
import {View, FlatList, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {ListItem, Card, Icon} from 'react-native-elements';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return { species: state.species }
}

class TripSpecies extends Component {

  static navigationOptions = {
    title: "Species Observed"
  }

  

  render() {

    const tripId = this.props.navigation.getParam('tripId');
    console.log('tripId', tripId)
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
    console.log('speciesArr', speciesArr)
    const tripSpeciesList = ({item}) => {
      return (
        <View>
          <ListItem title={item.sciName} subtitle={`${item.comName} - Total: ${item.total}`}/>
        </View>
      )
    }

    const RenderSpecies = ({speciesArr}) => {
      console.log('species', speciesArr)
      if (speciesArr.length !== 0) {
        return <FlatList data={speciesArr} renderItem={tripSpeciesList} keyExtractor={item => item._id.toString()}/>
      } else {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't found any species yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        )
      }
    }

    return (
      <View style={{flex: 1}}>
        <RenderSpecies speciesArr={speciesArr}/>
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

export default connect(mapStateToProps)(TripSpecies);