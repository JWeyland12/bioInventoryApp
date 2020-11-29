import React, { Component } from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {Input, Icon, Image} from 'react-native-elements';
import { postProject } from '../redux/actionCreators/projects';
import {connect} from 'react-redux';
import ImgPicker from './imagePickerComponent';

const mapDispatchToProps = {
  postProject,
}

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: '',
      projectState: '',
      projectCounty: '',
      selectedImage: ''
    };
  }
  

  static navigationOptions = {
    title: "Create New Project"
  }

  handleSubmit = () => {
    const { navigate } = this.props.navigation;
    this.props.postProject(this.state.projectName, this.state.projectState, this.state.projectCounty)
    this.resetForm()
    navigate('Projects')
  }

  confirmProject = () => {
    Alert.alert(
      'Do you want to create this project?',
      `${this.state.projectName} \n${this.state.projectCounty} county, ${this.state.projectState}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => this.handleSubmit(),
        }
      ],
      {canceleable: false}
    )
  }

  resetForm = () => {
    this.setState({
      projectName: '',
      projectState: '',
      projectCounty: ''
    })
  }


  render() {
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
        onChangeText={project => this.setState({projectName: project})}
        placeholder='Project Name'
        value={this.state.projectName}
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
        onChangeText={state => this.setState({projectState: state})}
        placeholder='State'
        value={this.state.projectState}
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
        onChangeText={county => this.setState({projectCounty: county})}
        placeholder='County'
        value={this.state.projectCounty}
      />
      <View>
          {/* <Image source={require('./images/stephensGap.jpg')}/>
          <Button title="Camera" onPress={this.getImageFromCamera} />
          <Button title='Gallery' onPress={this.getImageFromGallery}/> */}
          <ImgPicker onImageTaken={}/>
        </View>
      <View style={{margin: 10}}>
        <Button style={styles.button} title='Create Project' onPress={() => {this.confirmProject()}}/>
      </View>
      </View>
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(CreateProject);

const styles = StyleSheet.create({
  margins: {
    paddingTop: 10,
    paddingBottom: 10
  },
  centerButton: {
    justifyContent: 'center'
  }
})