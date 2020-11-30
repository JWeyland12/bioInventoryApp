import React, { useState } from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {postArea} from '../redux/actionCreators/areas';
import ImgPicker from './imagePickerComponent';
import LocationPicker from './locationPickerComponent';

const mapDispatchToProps = {
  postArea,
}

const CreateArea = props => {
  const [areaName, setAreaName] = useState('');
  const [areaGeoRef, setAreaGeoRef] = useState('');
  const [projectId] = useState(props.navigation.getParam('projectId'))

  // const projectId = this.props.navigation.getParam('projectId')


  const handleSubmit = () => {
    const {navigate} = props.navigation;
    props.postArea(projectId, areaName, areaGeoRef)
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
            onChangeText={state => setAreaName(state)}
            placeholder='Area'
            value={areaName}
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
            onChangeText={state => setAreaGeoRef(state)}
            placeholder='Geo Reference'
            value={areaGeoRef}
          />
          <LocationPicker onLocationTaken={locationTakenHandler} />
          <ImgPicker />
          <View style={{margin: 10}}>
            <Button style={styles.button} title='Create Area' onPress={() => {confirmArea()}}/>
          </View>
        </View>
      </View>
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