import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import TripMembers from './customStyledComponents/tripMembersComponent';
import tripSummaryComponent from './tripSummaryComponent';
import {connect} from 'react-redux';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';
import {addMember, 
        addImageToTrip, 
        addNoteToTrip, 
        updateTripNote,
        deleteMember,
        deleteTripInfoImage,
        deleteTripInfoNote} from '../redux/actionCreators/trips'

const mapStateToProps = state => {
  return {
    trips: state.trips,
    species: state.species
  }
}

const mapDispatchToProps = {
  addMember,
  addImageToTrip, 
  addNoteToTrip,
  updateTripNote,
  deleteMember,
  deleteTripInfoImage,
  deleteTripInfoNote
}

const TripInfo = (props) => {
  const [tripId, setTripId] = useState(props.navigation.getParam('tripId'))
  const [trip, setTrip] = useState(props.trips.trips.filter(trip => trip._id.toString() === tripId.toString())[0])
  const [total, setTotal] = useState(props.navigation.getParam('total'));

  console.log('members', trip.members)

  useEffect(() => {
    setTripId(props.navigation.getParam('tripId'))
    setTotal(props.navigation.getParam('total'))
    if (tripId) {
      setTrip(props.trips.trips.filter(trip => trip._id.toString() === tripId.toString())[0])
    }
  }, [props.trips])

  console.log('trip', trip)

  const findTotalObs = () => {
    let total = []
    props.species.species.forEach(s => {
      s.tripArr.forEach(t => {
        if (t.tripId.toString() === tripId.toString()) {
          total.push(t.total)
        }
      })
    })
    total = total.reduce((a, b) => {
      return a + b
    }, 0)
    return total
  }

  const addMemberHandler = (member) => {
    props.addMember(tripId, member)
  }

  const submitNoteHandler = (note, modalNote, noteId) => {
    if (note) {
      props.addNoteToTrip(tripId, note)
    }
    if (modalNote) {
      props.updateTripNote(tripId, noteId, modalNote)
    }
  }

  const newImageHandler = (image) => {
    props.addImageToTrip(tripId, image)
  }

  const deleteInfo = (imgObj, notesObj, member) => {
    if (imgObj) {
      props.deleteTripInfoImage(tripId, imgObj)
    }
    if (notesObj) {
      props.deleteTripInfoNote(tripId, notesObj)
    }
    if (member) {
      props.deleteMember(tripId, member)
    }
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <View style={{margin: 30}}>
        <Text style={{fontSize: 30}}>{trip.date}</Text>
      </View>
      <View>
        <Text style={{fontSize: 25}}>Members</Text>
      </View>
      <View>
        <TripMembers members={trip.members} addMemberHandler={addMemberHandler} deleteInfo={deleteInfo}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Unique Species Found</Text>
        <Text style={{fontSize: 20}}>{total}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Total Observations</Text>
        <Text style={{fontSize: 20}}>{findTotalObs()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Trip Notes</Text>
      </View>
      <View>
        <Notes notes={trip.notes} submitNoteHandler={submitNoteHandler} deleteInfo={deleteInfo}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Trip Images</Text>
        <InfoImages images={trip.images} newImageHandler={newImageHandler} deleteInfo={deleteInfo} />
      </View>
      
    </ScrollView>
  );
};

TripInfo.navigationOptions = {
  title: 'Trip Info'
}

const styles = StyleSheet.create({
  information: {
    padding: 10,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TripInfo);