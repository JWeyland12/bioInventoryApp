import React, { useState, useContext, useLayoutEffect } from "react";
import { ScrollView, View, FlatList, TouchableOpacity, StyleSheet, Text, Alert, Modal } from "react-native";
import { ListItem, Icon, Card, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import {postTrip, updateTrip, deleteTrip} from '../redux/actionCreators/trips';
import Swipeout from "react-native-swipeout";
import {UserContext} from './userContextComponent';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import FormInput from './customStyledComponents/formInputComponent';

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

  useLayoutEffect(() => {
    if (modalIndex) {
      setTripState()
    }
  }, [modalIndex])

  const showModal = () => {
    setIsModalOpen(!isModalOpen)
    setModalIndex('')
  };


  const setTripState = () => {
    const filteredTrip = props.trips.trips.find((trip) => trip._id.toString() === modalIndex.toString());
    setTripDate(filteredTrip.date)
    setIsModalOpen(!isModalOpen)
  };

  const handleSubmit = () => {
    props.updateTrip(modalIndex, tripDate, user.token)
    setIsModalOpen(!isModalOpen)
    setModalIndex('')
  }

  const tripList = ({ item }) => {
    const { navigate } = props.navigation;
    const tripId = item._id;
    const leftButton = [
      {
        text: "Edit",
        backgroundColor: "#008b8b",
        textSize: 100,
        onPress: () => setModalIndex(tripId),
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
      <View style={styles.listStyle}>
        <Swipeout left={leftButton} right={rightButton} autoClose={true}>
          <ListItem 
          title={item.date} 
          titleStyle={{fontSize: 20}}
          onPress={() => navigate("TripSpecies", {  projectId: projectId, areaId: areaId, tripId: item._id })} 
          topDivider
          bottomDivider
          containerStyle={{height: 75}}
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
        />
        </Swipeout>
      </View>
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
    <View style={{ flex: 1}}>
      <View style={styles.listStyle}>
        <ListItem 
          title={'Area Information'} 
          titleStyle={{fontSize: 20}}
          onPress={() => navigate('AreaInformation', {areaId: areaId, areaGeoRef: areaGeoRef})}
          bottomDivider
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
        />
      </View>
      <ScrollView>
        <RenderTrips trips={trips} />
      </ScrollView>
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => props.postTrip(areaId, user.token)}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={false} visible={isModalOpen} onRequestClose={() => showModal()}>
        <View style={{ margin: 10 }}>
          <FormInput 
            iconName='angle-right'
            onChangeText={input => setTripDate(input)}
            value={tripDate}
          />
          <View style={{ margin: 10, alignItems: 'center' }}>
            <RoundButton 
              title='Update Trip'
              onPress={() => handleSubmit()}
            />
          </View>
          <View style={{ margin: 10, alignItems: 'center' }}>
            <RoundButton 
              title='Cancel'
              style={{backgroundColor: 'firebrick'}}
              onPress={() => showModal()}
            />
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
  listStyle: {
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 25,
    overflow: 'hidden'
  }
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