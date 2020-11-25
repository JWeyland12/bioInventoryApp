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
    return (
      <View style={{margin: 10}}>
        <Text>Test View</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps)(SpeciesList);