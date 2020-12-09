import React, { useState, useEffect } from 'react';
import {View, Alert, StyleSheet, Text} from 'react-native';
import {Input, Icon, Button, Image} from 'react-native-elements';
import { postSpeciesFromTrip, updateSpeciesObservation, postSpeciesFromMaster } from "../redux/actionCreators/species";
import {connect} from 'react-redux';
import ImgPicker from './imagePickerComponent';

const mapDispatchToProps = {
  postSpeciesFromTrip,
  postSpeciesFromMaster,
  updateSpeciesObservation
}

const CreateSpecies = props => {
  const [sciName, setSciName] = useState('');
  const [comName, setComName] = useState('');
  const idObject = props.navigation.getParam('idObject');
  const [specimen, setSpecimen] = useState(props.navigation.getParam('specimen'));
  const [selectedImage, setSelectedImage] = useState('');
  let [total, setTotal] = useState(1);
  const [doesTripExist, setDoesTripExist] = useState(false)
  const {navigate} = props.navigation;
  
  if(idObject) {
    idObject.total = total
  }

  useEffect(() => {
    if(specimen) {
      speciesStateHandler()
      for (let i = 0; i <= specimen.tripArr.length - 1; i++) {
        if (specimen.tripArr[i].tripId === idObject.tripId) {
          setDoesTripExist(true)
        }
      }
    } else {
      setSpecimen('')
    }
  }, [specimen])

  const speciesStateHandler = async () => {
    const img = await specimen.img
    setSciName(specimen.sciName)
    setComName(specimen.comName)
    setSelectedImage(img)
  }

  (function () {
    if (doesTripExist) {
      setDoesTripExist(false);
      Alert.alert(
        'Species already observed on this trip!',
        'Edit species from trip to add details',
        [
          {
            text: 'Ok', 
            onPress: () => navigate('TripSpecies', {tripId: idObject.tripId})
          }
        ],
        {cancelable: false}
      )
    }
  })()
  console.log('doesTripExist', doesTripExist)

  const handleSubmit = () => {
    if (!specimen) {
      // create new species from trip or masterList
    {!idObject ? props.postSpeciesFromMaster(sciName, comName, selectedImage)
      : props.postSpeciesFromTrip(sciName, comName, selectedImage, idObject)}
    {!idObject ? navigate('SpeciesList') : navigate('TripSpecies', {tripId: idObject.tripId})}
    } else {
      // observing a species - submitting a tripObj to the species
      props.updateSpeciesObservation(specimen, idObject)
      navigate('TripSpecies', {tripId: idObject.tripId})
    }
  }

  const confirmSpecies = () => {
    const alertMsg = !specimen ? 'Do you want to enter this species into the database?' : 'Do you want to create this species observation?'
    Alert.alert(
      `${alertMsg}`,
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

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {!specimen ? (
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
              onChangeText={comName => setComName(comName)}
              placeholder='Common Name'
              value={comName}
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
              onChangeText={sciName => setSciName(sciName)}
              placeholder='Scientific Name'
              value={sciName}
            />
            <ImgPicker onImageTaken={imagePickedHandler}/>
          </View>
          {idObject ?
          (<View style={{alignItems: 'center'}}>
            <View style={styles.countButtons}>
              <Icon name='minus' type='font-awesome' raised reverseColor color='grey' onPress={() => setTotal(total - 1)}/>
              <Text style={{fontSize: 30, fontWeight: 'bold', marginHorizontal: 15}}>{total}</Text>
              <Icon name='plus' type='font-awesome' raised reverseColor color='grey' onPress={() => setTotal(total + 1)}/>
            </View>
          </View>
          ) : (
            null
          )}
          <View style={{margin: 10}}>
            <Button style={styles.button} title='Create Species' onPress={() => confirmSpecies()}/>
          </View>
        </View>
      ) : (
        <View style={{margin: 10, alignItems: 'center'}}>
          <View style={styles.imageContainer} >
            <Image style={styles.image} source={{uri: selectedImage}}/>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.textStyle}>{comName}</Text>
            <Text style={styles.textStyle}>{sciName}</Text>
            <Text style={{fontSize: 15}}>Total</Text>
          </View>
            <View style={styles.countButtons}>
              <Icon name='minus' type='font-awesome' raised reverseColor color='grey' onPress={() => setTotal(total - 1)}/>
              <Text style={{fontSize: 30, fontWeight: 'bold', marginHorizontal: 15}}>{total}</Text>
              <Icon name='plus' type='font-awesome' raised reverseColor color='grey' onPress={() => setTotal(total + 1)}/>
            </View>
          <View style={{marginVertical: 15}}>
            <Button title={'Submit Observation'} onPress={() => handleSubmit()}/>
          </View>
        </View>
      )}
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
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 10,
    borderColor: 'grey',
  },
  imageContainer: {
    borderRadius: 125,
    overflow: 'hidden',
    height: 250,
    width: 250,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
    marginBottom: 10
  }, 
  textStyle: {
    fontSize: 30
  },
  countButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})