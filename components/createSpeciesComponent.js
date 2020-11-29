import React, { Component } from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import { postSpeciesFromMaster } from "../redux/actionCreators/species";
import {connect} from 'react-redux';

const mapDispatchToProps = {
  postSpeciesFromMaster
}

class CreateSpecies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sciName: '',
      comName: '',
    };
  }

  static navigationOptions = {
    title: 'Enter Species'
  }

  handleSubmit = () => {
    const {navigate} = this.props.navigation;
    this.props.postSpeciesFromMaster(this.state.sciName, this.state.comName)
    this.resetForm()
    navigate('Species List')
  }

  confirmSpecies = () => {
    Alert.alert(
      'Do you want to enter this species into the database?',
      `${this.state.sciName} \n${this.state.comName}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => this.handleSubmit()
        }
      ],
      {cancelable: false}
    )
  }

  resetForm = () => {
    this.setState({
      sciName: '',
      comName: ''
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{margin: 10}}>
          <Input
            style={styles.margin}
            leftIcon={
              <Icon
                name='angle-right'
                type='font-awesome'
              />
            }
            leftIconContainerStyle={{paddingRight: 10}}
            onChangeText={sciName => this.setState({sciName: sciName})}
            placeholder='Scientific Name'
            value={this.state.sciName}
          />
          <Input
            style={styles.margin}
            leftIcon={
              <Icon
                name='angle-right'
                type='font-awesome'
              />
            }
            leftIconContainerStyle={{paddingRight: 10}}
            onChangeText={comName => this.setState({comName: comName})}
            placeholder='Common Name'
            value={this.state.comName}
          />
        </View>
        <View style={{margin: 10}}>
          <Button style={styles.button} title='Create Species' onPress={() => {this.confirmSpecies()}}/>
        </View>
      </View>
    );
  };
  }
  

export default connect(null, mapDispatchToProps)(CreateSpecies);

const styles = StyleSheet.create({
  margins: {
    paddingTop: 10,
    paddingBottom: 10
  },
  centerButton: {
    justifyContent: 'center'
  }
})