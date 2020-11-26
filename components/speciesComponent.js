import React, { Component } from 'react';
import {View, FlatList, Text} from 'react-native';
import { ListItem } from "react-native-elements";
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {species: state.species}
}

class SpeciesList extends Component {

  static navigationOptions = {
    title: 'Species List'
  }

  render() {

    const speciesAlpha = this.props.species.species.sort((a, b) => (a.sciName > b.sciName) ? 1 : -1)
    // console.log('speciesAlpha', speciesAlpha)

    const renderSpecies = ({item}) => {
      return (
        <ListItem title={item.sciName} subtitle={item.comName}/>
      )
    }

    const FlatSpeciesList = ({speciesAlpha}) => {
      console.log('speciesAlpha', speciesAlpha)
      return <FlatList data={speciesAlpha} renderItem={renderSpecies} keyExtractor={(item) => item._id.toString()}/>
    }
    return (
      <View style={{flex: 1}}>
        <FlatSpeciesList speciesAlpha={speciesAlpha}/>
      </View>
    );
  }
}

export default connect(mapStateToProps)(SpeciesList);