import React, { useState, useContext } from 'react';
import {View, ScrollView, Button, StyleSheet, Alert, Text} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {postArea} from '../redux/actionCreators/areas';
import ImgPicker from './imagePickerComponent';
import LocationPicker from './locationPickerComponent';
import {UserContext} from './userContextComponent';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import FormInput from './customStyledComponents/formInputComponent'

const mapDispatchToProps = {
  postArea,
}

const CreateArea = props => {
  const [areaName, setAreaName] = useState('');
  const [areaGeoRef, setAreaGeoRef] = useState('');
  const [altitude, setAltitude] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [karst, setKarst] = useState('');
  const [projectId] = useState(props.navigation.getParam('projectId'));
  const [selectedImage, setSelectedImage] = useState('');
  const {value} = useContext(UserContext);
  const [user, setUser] = value;

  // const projectId = this.props.navigation.getParam('projectId')


  const handleSubmit = () => {
    const {navigate} = props.navigation;
    props.postArea(projectId, areaName, areaGeoRef, altitude, accuracy, karst, selectedImage, user.token)
    resetForm()
    navigate('Areas')
  }

  const confirmArea = () => {
    Alert.alert(
      'Do you want to create this area?',
      `${areaName} \n${areaGeoRef}`,
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
    setAreaName(''),
    setAreaGeoRef('')
  }

  const locationTakenHandler = (location) => {
    const geoRef = {}
    console.log(location)
    geoRef.lat = location.coords.latitude
    geoRef.long = location.coords.longitude
    setAreaGeoRef(`${geoRef.lat}, ${geoRef.long}`)
    setAltitude(`${metersToFeet(location.coords.altitude).toString()}ft`)
    setAccuracy(`${metersToFeet(location.coords.accuracy).toString()}ft`)
  }

  const metersToFeet = (meters) => {
    const feet = meters * 3.281
    return feet
  }

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }
    
    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{margin: 10}}>
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setAreaName(input)}
            placeholder='Area'
            value={areaName}
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setGeoRef(input)}
            placeholder='Coordinates'
            value={areaGeoRef}
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setAltitude(input)}
            placeholder='Elevation'
            value={altitude}
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setKarst(input)}
            placeholder='Limestone type'
            value={karst}
          />
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Text>Accuracy: {accuracy}</Text>
          </View>
          <LocationPicker onLocationTaken={locationTakenHandler} />
          <ImgPicker onImageTaken={imagePickedHandler}/>
          <View style={{margin: 10, alignItems: 'center'}}>
            <RoundButton 
              title='Create Area'
              onPress={() => confirmArea()}
            />
          </View>
        </View>
      </ScrollView>
    );
}


CreateArea.navigationOptions = {
  title: 'Create New Area'
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