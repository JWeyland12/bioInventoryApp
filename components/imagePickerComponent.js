import React, {useState, createContext, useContext} from 'react';
import {View, Button, Text, StyleSheet, Image, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState();
  
  (async function updateImageHandler() {
    const updateImage = await props.updateImage
    if (updateImage) {
      setPickedImage(updateImage)
    }
  })()

  console.log('ip', props.updateImage)

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
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.75
    });
    setPickedImage(imageGal.uri)
    props.onImageTaken(imageGal.uri)
  }

  const takeImageHandler = async () => {
    const hasPermission = await verifyCameraPermissions 
    if (!hasPermission) {
      return
    }
    const imageCam = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.75
    });
    setPickedImage(imageCam.uri)
    props.onImageTaken(imageCam.uri)
  }
    return (
      <View style={styles.imagePicker}>
          {!pickedImage ? (
            <Text style={{margin: 15}}>No image selected yet</Text>
          ) : (
            <View style={styles.imagePreview}>
              <Image style={styles.image} source={{uri: pickedImage}} />
            </View>
          )}
        <View style={styles.imgButtons}>
          <Button style={styles.button} title='Take Image' onPress={takeImageHandler} />
          <View style={{margin: 5}}></View>
          <Button style={styles.button} title='Pick Image' onPress={pickImageHandler}/>
        </View>
      </View>
    );
}

export default ImgPicker;

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center'
  },
  imagePreview: {
    flexDirection: 'row',
    width: '75%',
    height: 200,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#000',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imgButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: '#008b8b'
  }
})