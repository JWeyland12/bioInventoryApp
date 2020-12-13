import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {Image, Icon, Button} from 'react-native-elements';
import {updateSpeciesObservation} from '../redux/actionCreators/species';
import {connect} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const mapStateToProps = state => {
  return {
    species: state.species
  }
}

const mapDispatchToProps = {
  updateSpeciesObservation
}

const SpeciesInfo = (props) => {
  const [specimen, setSpecimen] = useState({});
  const tripArrId = props.navigation.getParam('tripArrId');
  const speciesId = props.navigation.getParam('speciesId');
  const [total, setTotal] = useState(tripArrId.total);
  const [totalChanged, setTotalChanged] = useState(false)

  console.log('specimen', specimen)
  console.log('tripArrId', tripArrId)

  useEffect(() => {
    if(speciesId) {
      setSpecimen(props.species.species.filter(item => item._id.toString() === speciesId.toString())[0])
    }
    if (total !== tripArrId.total) {
      if(!totalChanged) {
        setTotalChanged(true)
      } 
    }
  })

  console.log('total', total)
  console.log('tripTotal', tripArrId.total)

  

  const updateTotalHandler = () => {
    console.log('fired')
    ToastAndroid.show('Total saved', ToastAndroid.SHORT, ToastAndroid.TOP, ToastAndroid.CENTER)
    tripArrId.total = total
    setTotalChanged(false)
    props.updateSpeciesObservation(specimen, {tripObj: {...tripArrId, total: total}})
  }

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
      // allowsMultipleSelection,
      aspect: [1,1],
      quality: 0.75
    });
    let img = imageGal.uri
    props.updateSpeciesObservation(specimen, tripArrId, img)
  }

  const takeImageHandler = async () => {
    const hasPermission = await verifyCameraPermissions 
    if (!hasPermission) {
      return
    }
    const imageCam = await ImagePicker.launchCameraAsync({
      aspect: [1,1],
      quality: 0.75,
    });
    // tripArrId.images.push(imageCam.uri)
    props.updateSpeciesObservation(specimen, tripArrId, imageCam.uri)
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 30, fontFamily: 'monospace'}}>{specimen.comName}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{uri: specimen.img}} style={styles.image}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 20}}>{specimen.sciName}</Text>
      </View>
      <View style={styles.information}>
        {!tripArrId ? null :
        (<View style={styles.information}>
          <Text style={{fontSize: 25}}>Total</Text>
          <View style={styles.countButtons}>
            <Icon name='minus' type='font-awesome' size={20} raised reverseColor color='grey' onPress={() => setTotal(total - 1)}/>
            <Text style={{fontSize: 25, marginHorizontal: 15}}>{total}</Text>
            <Icon name='plus' type='font-awesome' size={20} raised reverseColor color='grey' onPress={() => setTotal(total + 1)}/>
          </View>
          {!totalChanged ? null : (<Text style={{color: '#008b8b', fontWeight: 'bold'}} onPress={() => updateTotalHandler()}>Save</Text>)}
        </View>)}
        <View style={styles.information}>
          <Text style={{fontSize: 25}}>Rank</Text>
          <Text style={{fontSize: 20}}>placeHolder</Text>
        </View>
        <View style={styles.information}>
          <Text style={{fontSize: 25}}>Observation Images</Text>
          <Text style={{fontSize: 20}}>placeHolder</Text>
          <View>
            {/* {imageArr.forEach(image => {
              <Image source={{uri: image.uri}} />
            })} */}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button title={'Take Picture'} onPress={takeImageHandler} />
            <View style={{margin: 5}}></View>
            <Button title={'Add Images'} onPress={pickImageHandler} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

SpeciesInfo.navigationOptions = {
  title: 'Bio Info'
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: 'whitesmoke'
  },
  imageContainer: {
    width: 250, 
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    marginTop: 15
  },
  information: {
    padding: 10,
    alignItems: 'center'
  },
  countButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesInfo);