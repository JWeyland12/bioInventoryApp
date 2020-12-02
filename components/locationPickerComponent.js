import React, {useState} from 'react';
import {View, Button, Text, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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
      setPickedLocation({lat: location.coords.latitude, lgn: location.coords.longitude})
      props.onLocationTaken(location)
    } catch (err) {
      Alert.alert('Could not determine location, please try again', [{text: Okay}])
    }
    setFetching(false)

  }

  return (
    <View style={styles.locationPicker}>
      <View style={styles.button}>
        <Button title='Get Location' onPress={getLocationHandler}/>
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