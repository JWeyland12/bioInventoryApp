import React, { Component } from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import { postSpeciesFromMaster } from "../redux/actionCreators/species";
import {connect} from 'react-redux';
import ImgPicker from './imagePickerComponent';

const mapDispatchToProps = {
  postSpeciesFromMaster
}

const CreateSpecies = props => {
  const [sciName, setSciName] = useState('');
  const [comName, setComName] = useState('');

  const handleSubmit = () => {
    const {navigate} = props.navigation;
    props.postSpeciesFromMaster(sciName, comName)
    // resetForm()
    navigate('Species List')
  }

  const confirmSpecies = () => {
    Alert.alert(
      'Do you want to enter this species into the database?',
      `${sciName} \n${comName}`,
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

  // const resetForm = () => {
  //   this.setState({
  //     sciName: '',
  //     comName: ''
  //   })
  // }

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
          onChangeText={sciName => setSciName(sciName)}
          placeholder='Scientific Name'
          value={sciName}
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
          onChangeText={comName => setComName(comName)}
          placeholder='Common Name'
          value={comName}
        />
        <ImgPicker onImageTaken={imagePickedHandler}/>
      </View>
      <View style={{margin: 10}}>
        <Button style={styles.button} title='Create Species' onPress={() => {confirmSpecies()}}/>
      </View>
    </View>
  );
}

  CreateSpecies.navigationOptions = {
    title: 'Enter Species'
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