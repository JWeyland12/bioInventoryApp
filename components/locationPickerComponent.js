import React, {useState} from 'react';
import {View, Button, Text, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import RoundButton from './customStyledComponents/roundedButtonComponent';

const LocationPicker = props => {
  const [pickedLocation, setPickedLocation] = useState();
  const [isFetching, setFetching] = useState(false)

  const verifyLocationPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const getLocationHandler = async () => {
    const hasPermission = await verifyLocationPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setFetching(true)
      const location = await Location.getCurrentPositionAsync({
        timeout: 10000,
        accuracy: 5
      });
      console.log(location)
      props.onLocationTaken(location)
    } catch (err) {
      Alert.alert('Could not determine location, please try again', [{text: Okay}])
    }
    setFetching(false)

  }

  return (
    <View style={styles.locationPicker}>
      <View style={styles.button}>
        <RoundButton 
          title='Get Location'
          onPress={getLocationHandler}
          textStyle={{fontSize: 15}}
          style={{paddingHorizontal: 20}}
        />
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  locationPicker: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    width: '35%',
    margin: 15
  }
})