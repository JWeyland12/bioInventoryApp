import React, { useState, useContext } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Alert, Modal } from "react-native";
import { ListItem, Icon, Card, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import {postTrip, updateTrip, deleteTrip} from '../redux/actionCreators/trips';
import Swipeout from "react-native-swipeout";
import {UserContext} from './userContextComponent';


const mapStateToProps = (state) => {
  return { trips: state.trips };
};

const mapDispatchToProps = {
  postTrip,
  updateTrip,
  deleteTrip,
}

const Trips = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState('');
  const [tripDate, setTripDate] = useState('');
  const {value} = useContext(UserContext);
  const [user, setUser] = value;
  const projectId = props.navigation.getParam('projectId');
  const areaId = props.navigation.getParam("areaId");
  const areaGeoRef = props.navigation.getParam('areaGeoRef')
  const trips = props.trips.trips.filter((trips) => trips.areaId === areaId);
  const { navigate } = props.navigation;


  const showModal = (tripId) => {
    setModalIndex(tripId),
      () => setTripState()
  };


  const setTripState = () => {
    const filteredTrip = props.trips.trips.find((trip) => trip._id.toString() === state.modalIndex.toString());
    setTripDate(filteredTrip.date)
    setIsModalOpen(!isModalOpen)
  };

  const handleSubmit = () => {
    props.updateTrip(modalIndex, tripDate, user.token)
    setIsModalOpen(false)
  }

  const tripList = ({ item }) => {
    const { navigate } = props.navigation;
    const tripId = item._id;
    const leftButton = [
      {
        text: "Edit",
        backgroundColor: "#008b8b",
        textSize: 100,
        onPress: () => showModal(tripId),
      },
    ];

    const rightButton = [
      {
        text: "Delete",
        backgroundColor: 'red',
        onPress: () => {
          Alert.alert(
            'Do you want to delete this trip?',
            `${item.date}`,
            [
              {
                text: 'Cancel',
                type: 'cancel'
              },
              {
                text: 'Confirm',
                onPress: () => props.deleteTrip(item._id, user.token)
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
          <ListItem 
          title={item.date} 
          onPress={() => navigate("TripSpecies", {  projectId: projectId, areaId: areaId, tripId: item._id })} 
          topDivider
          bottomDivider
          containerStyle={{height: 75}}
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
        />
        </View>
      </Swipeout>
    )
  };


  const RenderTrips = ({ trips }) => {
    if (trips.length === 0) {
      return (
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
            <Text style={styles.textInCard}>You haven't created any trips yet!</Text>
            <Text></Text>
            <Text style={styles.textInCard}>Click the '+' button to add a trip!</Text>
          </Card>
        </View>
      );
    } else {
      return <FlatList data={trips} renderItem={tripList} keyExtractor={(item) => item._id.toString()} />;
    }
  };


  return (
    <View style={{ flex: 1 }}>
      {/* add area photo as avatar */}
      <ListItem 
        title={'Area Summary'} 
        onPress={() => navigate('AreaSummary', {areaId: areaId, areaGeoRef: areaGeoRef})}
        bottomDivider
        containerStyle={{height: 75}}
        rightIcon={<Icon name='angle-right' type='font-awesome'/>}
      />
      <RenderTrips trips={trips} />
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => props.postTrip(areaId, user.token)}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={false} visible={isModalOpen} onRequestClose={() => showModal()}>
        <View style={{ margin: 10 }}>
          <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(trip) => setTripDate(trip)} value={tripDate} />
          <View style={{ margin: 10 }}>
            <Button
              style={styles.button}
              title="Update Trip"
              onPress={() => {
                handleSubmit();
              }}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Button style={(styles.button, { backgroundColor: "red" })} title="Cancel" onPress={() => setIsModalOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

Trips.navigationOptions = {
  title: "Trips",
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

export default connect(mapStateToProps, mapDispatchToProps)(Trips);


// const speciesSelector = () => {
    //   if (tripId === undefined) {
    //     const tripArr = tripFil.map((trip) => trip.id);
    //     const master = state.species.filter((species) => tripArr.includes(species.index));
    //     return master;
    //   } else if (tripId.toString()) {
    //     const species = this.state.species.filter((species) => species.index === tripId);
    //     return species;
    //   } else {
    //     const noReturn = null;
    //     return noReturn;
    //   }
    // };