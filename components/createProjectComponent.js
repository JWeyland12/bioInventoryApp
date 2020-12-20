import React, { useState, useContext } from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {Input, Icon, Image} from 'react-native-elements';
import { postProject } from '../redux/actionCreators/projects';
import {connect} from 'react-redux';
import ImgPicker from './imagePickerComponent';
import { UserContext } from './userContextComponent';
import RoundButton from './roundedButtonComponent';
import FormInput from './formInputComponent';

const mapDispatchToProps = {
  postProject,
}

const CreateProject = props => {
  const [projectName, setProjectName] = useState('');
  const [projectState, setProjectState] = useState('');
  const [projectCounty, setProjectCounty] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const {value} = useContext(UserContext)
  const [user, setUser] = value

  console.log('user1', user)

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const handleSubmit = () => {
    const { navigate } = props.navigation;
    props.postProject(projectName, projectState, projectCounty, selectedImage, user.token)
    resetForm()
    navigate('Projects')
  }

  const confirmProject = () => {
    Alert.alert(
      'Do you want to create this project?',
      `${projectName} \n${projectCounty} county, ${projectState}`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => handleSubmit(),
        }
      ],
      {canceleable: false}
    )
  }

  const resetForm = () => {
    setProjectName(''),
    setProjectState(''),
    setProjectCounty('')
  }


    return (
      <View>
        <View style={{margin: 10}}>
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setProjectName(input)}
            value={projectName}
            placeholder='Property Name'
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setProjectState(input)}
            value={projectState}
            placeholder='State'
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setProjectCounty(input)}
            value={projectCounty}
            placeholder='County'
          />
          <View>
            <ImgPicker onImageTaken={imagePickedHandler}/>
          </View>
          <View style={{alignItems: 'center', margin: 30}}>
            <RoundButton title='Create Project' onPress={() => confirmProject()} />
          </View>
        </View>
      </View>
    );
}
CreateProject.navigationOptions = {
  title: "Create New Project"
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