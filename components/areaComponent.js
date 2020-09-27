import React, { Component } from 'react';
import {FlatList, View, TouchableOpacity, Text} from 'react-native';
import {ListItem, Icon,} from 'react-native-elements';
import AREAS from '../shared/area';
import PROJECTSLIST from '../shared/projects';

class Areas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: AREAS,
      projectsList: PROJECTSLIST,
    };
  }

  static navigationOptions = {
    title: "Area"
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Test</Text>
      </View>
    );
  }
}

export default Areas;