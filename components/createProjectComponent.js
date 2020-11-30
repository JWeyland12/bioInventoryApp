import React, { useState } from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {Input, Icon, Image} from 'react-native-elements';
import { postProject } from '../redux/actionCreators/projects';
import {connect} from 'react-redux';
import ImgPicker from './imagePickerComponent';

const mapDispatchToProps = {
  postProject,
}

const CreateProject = props => {
  const [projectName, setProjectName] = useState('');
  const [projectState, setProjectState] = useState('');
  const [projectCounty, setProjectCounty] = useState('');
  const [selectedImage, setSelectedImage] = useState();


  

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const handleSubmit = () => {
    const { navigate } = props.navigation;
    props.postProject(projectName, projectState, projectCounty, selectedImage)
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
        <Input
            style={styles.margin}
          leftIcon={
            <Icon 
              name='angle-right'
              type='font-awesome'
            />
          }
        leftIconContainerStyle={{paddingRight: 10}}
        onChangeText={project => setProjectName(project)}
        placeholder='Project Name'
        value={projectName}
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
        onChangeText={state => setProjectState(state)}
        placeholder='State'
        value={projectState}
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
        onChangeText={county => setProjectCounty(county)}
        placeholder='County'
        value={projectCounty}
      />
      <View>
          <ImgPicker onImageTaken={imagePickedHandler}/>
        </View>
      <View style={{margin: 10}}>
        <Button style={styles.button} title='Create Project' onPress={() => {confirmProject()}}/>
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