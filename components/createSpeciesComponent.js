import React, { useState, useEffect, useContext } from 'react';
import {View, Alert, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import { postSpeciesFromTrip, updateSpeciesObservation, postSpeciesFromMaster } from "../redux/actionCreators/species";
import {connect} from 'react-redux';
import ImgPicker from './imagePickerComponent';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import FormInput from './customStyledComponents/formInputComponent';
import {UserContext} from './userContextComponent';
import NetInfo from '@react-native-community/netinfo';
import SciNamesModal from './customStyledComponents/sciNamesModal'

const mapDispatchToProps = {
  postSpeciesFromTrip,
  postSpeciesFromMaster,
  updateSpeciesObservation
}

const CreateSpecies = props => {
  const [sciName, setSciName] = useState('');
  const [comName, setComName] = useState('');
  const [rank, setRank] = useState('')
  const idObject = props.navigation.getParam('idObject');
  const [specimen, setSpecimen] = useState(props.navigation.getParam('specimen'));
  const [selectedImage, setSelectedImage] = useState('');
  let [total, setTotal] = useState(1);
  const [doesTripExist, setDoesTripExist] = useState(false)
  const {navigate} = props.navigation;
  const {value} = useContext(UserContext);
  const [user, setUser] = value;
  let listArr = [];
  const [sciNameArr, setSciNameArr] = useState([])
  const [autoList, setAutoList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [specimen, sciNameArr])

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

  const handleSubmit = () => {
    if (!specimen) {
      // create new species from trip or masterList
    {!idObject ? props.postSpeciesFromMaster(sciName, comName, rank, selectedImage, user)
      : props.postSpeciesFromTrip(sciName, comName, rank, selectedImage, idObject, user)}
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
      `${comName} \n${sciName}`,
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

  const fetchData = async (info) => {
    const netInfo = await NetInfo.fetch()
    console.log(netInfo)
    if (netInfo.isConnected) {
      let str = info
      const searchQuery = str.toLowerCase().replace(/ /g, '%')
      const response = await fetch(`https://api.gbif.org/v1/species/search?q=${searchQuery}`)
      const list = await response.json()
      console.log('list', list)
      for (let i = 0; i <= list.results.length - 1; i++) {
        if (!listArr.includes(list.results[i].canonicalName)) {
          listArr.push(list.results[i].canonicalName)
        }
      }
      setSciNameArr(listArr)
      setSciName(listArr[0])
      setAutoList(true)
    } else {
      return
    }
  }

  const modalHandler = i => {
    setSciName(i)
    setIsModalOpen(!isModalOpen)
  }


  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {!specimen ? (
        <ScrollView>
          <View style={{margin: 10}}>
            <FormInput 
              iconName='angle-right' 
              onChangeText={input => setComName(input)}
              placeholder='Common Name'
              value={comName}
              onBlur={() => fetchData(comName)}
            />
            <FormInput 
              iconName='angle-right' 
              onChangeText={input => setSciName(input)}
              placeholder='Scientific Name'
              value={sciName}
              leftIcon={!autoList ? false : true}
              leftIconName='angle-down'
              leftIconOnPress={() => setIsModalOpen(!isModalOpen)}
            />
            <TouchableOpacity style={{position: 'absolute'}}>
              <SciNamesModal items={sciNameArr} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} modalHandler={modalHandler} />
            </TouchableOpacity>
            <FormInput 
              iconName='angle-right' 
              onChangeText={input => setRank(input)}
              placeholder='Rank'
              value={rank}
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
          <View style={{margin: 30, alignItems: 'center'}}>
            <RoundButton title='Create Species' textStyle={{color: 'white'}} onPress={() => confirmSpecies()} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={{margin: 10}} contentContainerStyle={{alignItems: 'center'}}>
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
            <RoundButton 
              title='Submit Observation'
              onPress={() => handleSubmit()}
            />
          </View>
        </ScrollView>
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
  },
  picker: {
    backgroundColor: '#f1f3f6',
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden'
  }
})