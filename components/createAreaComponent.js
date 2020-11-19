import React, { Component } from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {postArea} from '../redux/actionCreators/areas';

const mapDispatchToProps = {
  postArea,
}

class CreateArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaName: '',
      areaGeoRef: ''
    };
  }

  static navigationOptions = {
    title: 'Create New Area'
  }

  render() {
  const projectId = this.props.navigation.getParam("projectId");

  const handleSubmit = () => {
    const {navigate} = this.props.navigation;
    this.props.postArea(projectId, this.state.areaName, this.state.areaGeoRef)
    resetForm()
    navigate('Areas')
  }

  const confirmArea = () => {
    Alert.alert(
      'Do you want to create this area?',
      `${this.state.areaName} \n${this.state.areaGeoRef}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => handleSubmit()
        }
      ],
      {cancelable: false}
    )
  }

  const resetForm = () => {
    this.setState({
      areaName: '',
      areaGeoRef: ''
    })
  }
    
    
    return (
      <View>
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
            onChangeText={state => this.setState({areaName: state})}
            placeholder='Area'
            value={this.state.areaName}
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
            onChangeText={state => this.setState({areaGeoRef: state})}
            placeholder='Geo Reference'
            value={this.state.areaGeoRef}
          />
          <View style={{margin: 10}}>
            <Button style={styles.button} title='Create Area' onPress={() => {confirmArea()}}/>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(CreateArea);

const styles = StyleSheet.create({
  margins: {
    paddingTop: 10,
    paddingBottom: 10
  },
  centerButton: {
    justifyContent: 'center'
  }
})