import React, { useState, useLayoutEffect, useContext } from "react";
import { ScrollView, FlatList, View, TouchableOpacity, Text, StyleSheet, Alert, Modal } from "react-native";
import { ListItem, Icon, Card, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import {updateArea, deleteArea} from '../redux/actionCreators/areas';
import Swipeout from 'react-native-swipeout';
import ImgPicker from './imagePickerComponent';
import LocationPicker from './locationPickerComponent';
import {UserContext} from './userContextComponent';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import FormInput from './customStyledComponents/formInputComponent';

const mapStateToProps = (state) => {
  return { areas: state.areas };
};

const mapDispatchToProps = {
  updateArea,
  deleteArea
}

const Areas = props => {
  const [isModalOpen, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState('');
  const [areaName, setAreaName] = useState('');
  const [areaGeoRef, setAreaGeoRef] = useState('');
  const [altitude, setAltitude] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [karst, setKarst] = useState('');
  const [selectedImage, setSelectedImage] = useState('')
  const {value} = useContext(UserContext);
  const [user, setUser] = value;
  const { navigate } = props.navigation;
  const projectId = props.navigation.getParam("projectId");
  const areas = props.areas.areas.filter((areas) => areas.project === projectId).sort((a, b) => (a.area.toUpperCase() > b.area.toUpperCase()) ? 1 : -1);

  useLayoutEffect(() => {
    if(modalIndex) {
      setAreaState()
    }
  }, [modalIndex])

  const hideModal = () => {
    setModal(!isModalOpen)
    setModalIndex('')
  }

  const setAreaState = () => {
    const filteredArea = props.areas.areas.find(area => area._id === modalIndex)
      setAreaName(filteredArea.area);
      setAreaGeoRef(filteredArea.geoRef);
      setSelectedImage(filteredArea.img);
      setAltitude(filteredArea.altitude);
      setAccuracy(filteredArea.accuracy);
      setKarst(filteredArea.karst)
      setModal(!isModalOpen)
  }

  const handleSubmit = () => {
    props.updateArea(modalIndex, areaName, areaGeoRef, altitude, accuracy, karst, selectedImage, user.token)
    hideModal()
  }

  const areasList = ({ item }) => {
    const { navigate } = props.navigation;
    const areaId = item._id;
    const leftButton = [
      {
        text: 'Edit',
        backgroundColor: '#008b8b',
        onPress: () => setModalIndex(areaId)
      }
    ];

    const rightButton = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => {
          Alert.alert(
            'Do you want to delete this area?',
            `${item.area}`,
            [
              {
                text: 'Cancel',
                type: 'cancel'
              },
              {
                text: 'Confirm',
                onPress: () => props.deleteArea(item._id, user.token)
              }
            ],
            {cancelable: false}
          )
        }
      }
    ]

    return (
      <View style={styles.listStyle}>
        <Swipeout left={leftButton} right={rightButton} autoClose={true}>
          <ListItem title={item.area} 
            titleStyle={{fontSize: 20}}
            subtitle={`${item.karst} limestone`} 
            leftAvatar={{ source: {uri: item.img}, size: 'large'}} 
            onPress={() => navigate("Trips", { areaId: item._id, areaGeoRef: item.geoRef, projectId: projectId })} 
            bottomDivider topDivider
            rightIcon={<Icon name='angle-right' type='font-awesome'/>}
          />
        </Swipeout>
      </View>
    )
  };

  const locationTakenHandler = (location) => {
    const geoRef = {}
    console.log(location)
    geoRef.lat = location.coords.latitude
    geoRef.long = location.coords.longitude
    setAreaGeoRef(`${geoRef.lat}, ${geoRef.long}`)
    setAltitude(`${metersToFeet(location.coords.altitude).toString()}ft`)
    setAccuracy(`${metersToFeet(location.coords.accuracy).toString()}ft`)
  }

  const metersToFeet = meters => {
    const feet = meters * 3.281
    return parseInt(feet)
  }

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const RenderAreas = ({ areas }) => {
    if (areas.length === 0) {
      return (
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
            <Text style={styles.textInCard}>You haven't created any areas yet!</Text>
            <Text></Text>
            <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
          </Card>
        </View>
      );
    } else {
      return <FlatList data={areas} renderItem={areasList} keyExtractor={(item) => item._id.toString()} />;
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ListItem 
        title='Property Information'
        titleStyle={{fontSize: 20}}
        rightIcon={<Icon 
          name='angle-right'
          type='font-awesome'
        />}
        onPress={() => navigate('ProjectInfo', {projectId: projectId})}
      />
      <ScrollView>
        <RenderAreas areas={areas} />
      </ScrollView>
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateArea', {projectId: projectId})}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType='fade' transparent={false} visible={isModalOpen} onRequestClose={() => hideModal()}>
        <ScrollView style={{margin:10}}>
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setAreaName(input)}
            value={areaName}
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setAreaGeoRef(input)}
            value={areaGeoRef}
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setAltitude(input)}
            value={altitude}
          />
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setKarst(input)}
            value={karst}
          />
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Text>Accuracy: {accuracy}</Text>
          </View>
          <LocationPicker onLocationTaken={locationTakenHandler} />
          <ImgPicker onImageTaken={imagePickedHandler} updateImage={selectedImage} />
          <View style={{ margin: 10, alignItems: 'center' }}>
            <RoundButton title='Update Area' onPress={() => handleSubmit()} />
          </View>
          <View style={{ margin: 10, alignItems: 'center' }}>
            <RoundButton title='Cancel' style={{backgroundColor: 'red'}} onPress={() => hideModal()} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}


Areas.navigationOptions = {
  title: `Areas`
};

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
  listStyle: {
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 25,
    overflow: 'hidden'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
