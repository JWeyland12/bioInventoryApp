import React, { useState, useLayoutEffect } from "react";
import { FlatList, View, TouchableOpacity, Text, StyleSheet, Alert, Modal } from "react-native";
import { ListItem, Icon, Card, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import {updateArea, deleteArea} from '../redux/actionCreators/areas';
import Swipeout from 'react-native-swipeout';
import ImgPicker from './imagePickerComponent';
import LocationPicker from './locationPickerComponent';

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
  const [areaGeoRef, setAreaGeoRef] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const { navigate } = props.navigation;
  const projectId = props.navigation.getParam("projectId");
  const areas = props.areas.areas.filter((areas) => areas.project === projectId);

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
      setSelectedImage(filteredArea.img)
      setModal(!isModalOpen)
  }

  const handleSubmit = () => {
    props.updateArea(modalIndex, areaName, areaGeoRef, selectedImage)
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
                onPress: () => props.deleteArea(item._id)
              }
            ],
            {cancelable: false}
          )
        }
      }
    ]

    return (
      <Swipeout left={leftButton} right={rightButton} autoClose={true}>
        <View>
          <ListItem title={item.area} 
            subtitle={item.geoRef} 
            leftAvatar={{ source: {uri: item.img}, size: 'large'}} 
            onPress={() => navigate("Trips", { areaId: item._id, areaGeoRef: item.geoRef, projectId: projectId })} 
            bottomDivider topDivider
            rightIcon={<Icon name='angle-right' type='font-awesome'/>}
          />
        </View>
      </Swipeout>
    )
  };

  const locationTakenHandler = (location) => {
    const geoRef = {}
    console.log(location)
    geoRef.lat = location.coords.latitude
    geoRef.long = location.coords.longitude
    setAreaGeoRef(`${geoRef.lat}, ${geoRef.long}`)
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
    <View style={{ flex: 1 }}>
      <RenderAreas areas={areas} />
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateArea', {projectId: projectId})}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType='fade' transparent={false} visible={isModalOpen} onRequestClose={() => hideModal()}>
        <View style={{margin:10}}>
        <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(area) => setAreaName(area)} value={areaName} />
        <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(geoRef) => setAreaGeoRef(geoRef)} value={areaGeoRef} />
        <LocationPicker onLocationTaken={locationTakenHandler} />
        <ImgPicker onImageTaken={imagePickedHandler} updateImage={selectedImage} />
        <View style={{ margin: 10 }}>
            <Button
              style={styles.button}
              title="Update Area"
              onPress={() => {
                handleSubmit();
              }}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Button style={(styles.button, { backgroundColor: "red" })} title="Cancel" onPress={() => hideModal()} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

Areas.navigationOptions = {
  title: "Areas",
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
