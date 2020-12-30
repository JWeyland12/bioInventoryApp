import React, { useState, useLayoutEffect, useContext } from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity, Modal, Alert, Switch, ScrollView, ToastAndroid} from 'react-native';
import { ListItem, Icon, Input, Button } from "react-native-elements";
import {connect} from 'react-redux';
import Swipeout from 'react-native-swipeout';
import ImgPicker from './imagePickerComponent';
import {updateSpecies, deleteSpeciesFromMaster} from '../redux/actionCreators/species';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import FormInput from './customStyledComponents/formInputComponent';
import {UserContext} from './userContextComponent';
import NetInfo from '@react-native-community/netinfo';
import SciNamesModal from './customStyledComponents/sciNamesModal'

const mapStateToProps = state => {
  return {species: state.species}
}

const mapDispatchToProps = {
  updateSpecies,
  deleteSpeciesFromMaster
}

const SpeciesList = props => {
  const [isModalOpen, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState('')
  const [sciName, setSciName] = useState('');
  const [comName, setComName] = useState('');
  const [rank, setRank] = useState('')
  const [selectedImage, setSelectedImage] = useState('');
  const [specimen, setSpecimen] = useState([])
  const {navigate} = props.navigation
  const [defaultSpecies, setDefaultSpecies] = useState(props.species.species.filter(item => item.default === true)
  .sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1))
  const [speciesAlpha, setSpeciesAlpha] = useState(props.species.species.filter(item => item.default === false)
  .sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1))
  const {value} = useContext(UserContext)
  const [user, setUser] = value
  const [switchView, setSwitchView] = useState(false);
  let listArr = [];
  const [sciNameArr, setSciNameArr] = useState([])
  const [autoList, setAutoList] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [defaultView, setDefaultView] = useState(true);

  useLayoutEffect(() => {
    if (modalIndex) {
      setSpeciesState()
    }
    if (switchView) {
      setDefaultSpecies(props.species.species.filter(item => item.default === true)
      .sort((a, b) => (a.sciName.toUpperCase() > b.sciName.toUpperCase()) ? 1 : -1))
      setSpeciesAlpha(props.species.species.filter(item => item.default === false)
      .sort((a, b) => (a.sciName.toUpperCase() > b.sciName.toUpperCase()) ? 1 : -1))
    } else {
      setDefaultSpecies(props.species.species.filter(item => item.default === true)
      .sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1))
      setSpeciesAlpha(props.species.species.filter(item => item.default === false)
      .sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1))
    }
  }, [props.species, switchView, modalIndex]);

  const setSpeciesState = () => {
    const findSpecies = props.species.species.find(species => species._id.toString() === modalIndex.toString())
    setSpecimen(findSpecies);
    setSciName(findSpecies.sciName);
    setComName(findSpecies.comName);
    findSpecies.rank ? setRank(findSpecies.rank) : setRank('Unknown')
    setSelectedImage(findSpecies.img);
    setModal(!isModalOpen);
    fetchData(comName)
  }

  const showModal = () => {
    setModal(!isModalOpen);
    setModalIndex('');
  };

  const handleSubmit = () => {
    props.updateSpecies(modalIndex, sciName, comName, rank, selectedImage, specimen, user);
    ToastAndroid.show('Species Updated', ToastAndroid.CENTER, ToastAndroid.BOTTOM)
    setModal(!isModalOpen)
    setModalIndex('')
    setAutoList(!autoList)
  }

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const renderSpecies = ({item}) => {
    const leftButton = [
      {
        text: "Edit",
        backgroundColor: "#008b8b",
        textSize: 100,
        onPress: () => setModalIndex(item._id)
      },
    ];

    const rightButton = [
      {
        text: "Delete",
        backgroundColor: 'red',
        onPress: () => {
          Alert.alert(
            'Do you want to delete this specimen?',
            `${item.comName} \n${item.sciName}`,
            [
              {
                text: 'Cancel',
                type: 'cancel'
              },
              {
                text: 'Confirm',
                onPress: () => props.deleteSpeciesFromMaster(item, user)
              }
          ],
          {cancelable: false}
          )
        }
      }
    ]
    return (
      <View style={styles.speciesList}>
        <Swipeout left={leftButton} right={rightButton} autoClose={true}>
          <ListItem 
            title={!switchView ? item.comName : item.sciName} 
            subtitle={!switchView ? item.sciName : item.comName}
            leftAvatar={{source: {uri: item.img}, size: 'medium'}}
            bottomDivider
            topDivider
            rightIcon={<Icon name='angle-right' type='font-awesome'/>}
            onPress={() => navigate('MasterSpeciesInfo', {specimen: item})}
          />
        </Swipeout>
      </View>
    )
  }

  const fetchData = async (info) => {
    const netInfo = await NetInfo.fetch()
    console.log(netInfo)
    if (netInfo.isConnected) {
      let str = info
      const searchQuery = str.toLowerCase().replace(/ /g, '%')
      const response = await fetch(`https://api.gbif.org/v1/species/search?q=${searchQuery}`)
      const list = await response.json()
      for (let i = 0; i <= list.results.length - 1; i++) {
        if (!listArr.includes(list.results[i].canonicalName)) {
          listArr.push(list.results[i].canonicalName)
        }
      }
      setSciNameArr(listArr)
      // setSciName(listArr[0])
      setAutoList(true)
    } else {
      return
    }
  }

  const FlatSpeciesList = ({speciesAlpha}) => {
    return (
      <View>
        <View style={{flexDirection: 'row', marginHorizontal: 12, marginTop: 12}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'gray'}}>Default Species</Text>
            <Switch onChange={() => setDefaultView(!defaultView)} value={defaultView} />
          </View>
          <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
            <Text style={{color: 'gray'}}>Sort by Scientific Name</Text>
            <Switch onChange={() => setSwitchView(!switchView)} value={switchView} />
          </View>
        </View>
        {!defaultView ? null : (<FlatList data={defaultSpecies} renderItem={renderSpecies} keyExtractor={item => item._id.toString()} />)}
        <View style={{margin: 12}}>
          <Text style={{color: 'gray'}}>My Species</Text>
        </View>
        <FlatList data={speciesAlpha} renderItem={renderSpecies} keyExtractor={(item) => item._id.toString()}/>
      </View>
    )
  }

  const modalHandler = i => {
    setSciName(i)
    setModalView(!modalView)
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <FlatSpeciesList speciesAlpha={speciesAlpha}/>
      </ScrollView>
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateSpecies')}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType='fade' transparent={false} visible={isModalOpen} onRequestClose={() => showModal()}>
        <View style={{margin: 10}}>
          <FormInput 
            iconName='angle-right'
            value={comName}
            onChangeText={text => setComName(text)}
            onBlur={() => fetchData(comName)}
          />
          <FormInput 
            iconName='angle-right'
            value={sciName}
            onChangeText={text => setSciName(text)}
            leftIcon={!autoList ? false : true}
            leftIconName='angle-down'
            leftIconOnPress={() => setModalView(!modalView)}
          />
          <TouchableOpacity style={{position: 'absolute'}}>
              <SciNamesModal items={sciNameArr} isModalOpen={modalView} modalHandler={modalHandler} />
            </TouchableOpacity>
          <FormInput 
            iconName='angle-right'
            value={rank}
            onChangeText={text => setRank(text)}
          />
          <ImgPicker onImageTaken={imagePickedHandler} updateImage={selectedImage} />
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <RoundButton title='Update Species' onPress={() => handleSubmit()} />
          </View>
          <View style={{ margin: 10, alignItems: 'center' }}>
            <RoundButton title='Cancel' style={{backgroundColor: 'firebrick'}} onPress={() => showModal()} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

SpeciesList.navigationOptions = {
  title: 'Species List'
}


export default connect(mapStateToProps, mapDispatchToProps)(SpeciesList);

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },
  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
  textInCard: {
    top: 30,
    fontSize: 20,
    alignContent: "center",
    textAlign: "center",
    color: "dimgray",
  },
  emptyScreenCard: {
    width: "60%",
    height: 250,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 10,
  },
  margin: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  speciesList: {
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 25,
    overflow: 'hidden'
  }
});