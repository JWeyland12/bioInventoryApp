import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { Card } from 'react-native-elements';
import {SPECIES} from '../shared/inventory'

class Species extends Component {
  constructor(props) {
    super(props);
    this.state = {
      species: SPECIES,
    };
  }

  render() {
  const specimen = this.props.navigation.getParam('specimen')
    return (
      <View style={{flex: 1}}>
        <Card
          image={require('./images/caveSalamander.jpg')}
        >
          <Text>{specimen.comName}</Text>
          <Text>{specimen.sciName}</Text>
        </Card>
      </View>
    );
  }
}

export default Species;