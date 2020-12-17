import React, {useState} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const InfoImages = (props) => {
  //image upload from camera or gallery
  const verifyCameraPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const verifyGalleryPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const pickImageHandler = async () => {
    const hasPermission = await verifyGalleryPermissions()
    if (!hasPermission) {
      return
    }
    const imageGal = await ImagePicker.launchImageLibraryAsync({
      aspect: [1,1],
      quality: 0.75,
      allowsEditing: true
    });
    props.newImageHandler(imageGal.uri)
  }

  const takeImageHandler = async () => {
    const hasPermission = await verifyCameraPermissions 
    if (!hasPermission) {
      return
    }
    const imageCam = await ImagePicker.launchCameraAsync({
      aspect: [1,1],
      quality: 0.75,
      allowsEditing: true
    });
    props.newImageHandler(imageCam.uri)
  }
  
  return (
    <View style={{flexDirection: 'row', marginTop: 20}}>
      <Button title={'Take Picture'} onPress={takeImageHandler} />
      <View style={{margin: 5}}></View>
      <Button title={'Add Images'} onPress={pickImageHandler} />
    </View>
  );
};

export default InfoImages;