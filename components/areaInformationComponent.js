import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-elements';
import {connect} from 'react-redux';
import {UserContext} from './userContextComponent';
import {updateAreaNote, addNoteToArea, addImageToArea, deleteAreaInfoImage, deleteAreaInfoNote} from '../redux/actionCreators/areas';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';

const mapStateToProps = state => {
  return {
    areas: state.areas,
    trips: state.trips,
    species: state.species
  }
};

const mapDispatchToProps = {
  addNoteToArea,
  updateAreaNote,
  addImageToArea,
  deleteAreaInfoImage,
  deleteAreaInfoNote
}

const AreaInformation = (props) => {
  const [areaId, setAreaId] = useState(props.navigation.getParam('areaId'));
  const [area, setArea] = useState(props.areas.areas.filter(area => area._id.toString() === areaId.toString())[0]);
  const {navigate} = props.navigation;
  const [sortedSpecies, setSortedSpecies] = useState([]);
  const numberOfTrips = props.trips.trips.filter(trip => trip.areaId.toString() === areaId.toString()).length;
  const numberOfSpecies = [];
  const {value} = useContext(UserContext);
  const [user, setUser] = value;

  (function() {
    props.species.species.forEach(s => {
      s.tripArr.forEach(t => {
        if(t.areaId.toString() === areaId.toString()) {
          // totalObs.push(t.total)
          if(numberOfSpecies.indexOf(s) === -1) {
            numberOfSpecies.push(s)
          }
        }
      })
    })
  })()

  useEffect(() => {
    if (props.areas.areas) {
      setArea(props.areas.areas.filter(area => area._id.toString() === areaId.toString())[0])
      setSortedSpecies(numberOfSpecies.sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1))
    }
  }, [props.areas])

  const findTotalObs = () => {
    let total = []
    numberOfSpecies.forEach(s => {
      s.tripArr.forEach(t => {
        if (t.areaId.toString() === areaId.toString()) {
          total.push(t.total)
        }
      })
    })
    total = total.reduce((a, b) => {
      return a + b
    }, 0)
    return total
  }

  const submitNoteHandler = (note, modalNote, noteId) => {
    if (note) {
      props.addNoteToArea(areaId, note, user.token)
    }
    if (modalNote) {
      props.updateAreaNote(areaId, noteId, modalNote, user.token)
    }
  }

  const newImageHandler = (image) => {
    props.addImageToArea(areaId, image, user.token)
  }

  const deleteInfo = (imgObj, notesObj) => {
    if (imgObj) {
      props.deleteAreaInfoImage(areaId, imgObj)
    }
    if (notesObj) {
      props.deleteAreaInfoNote(areaId, notesObj)
    }
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 30, fontFamily: 'monospace'}}>{area.area}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{uri: area.img}} style={styles.image}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Limestone Type</Text>
        <Text selectable style={{fontSize: 20}}>{area.karst}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Coordinates</Text>
        <Text selectable style={{fontSize: 20}}>{area.geoRef}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Elevation</Text>
        <Text selectable style={{fontSize: 20}}>{area.altitude}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Location Accuracy</Text>
        <Text selectable style={{fontSize: 20}}>{area.accuracy}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Trips</Text>
        <Text selectable style={{fontSize: 20}}>{numberOfTrips}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Unique Species Found</Text>
        <Text selectable style={{fontSize: 20}}>{numberOfSpecies.length}</Text>
        <Text selectable style={{fontSize: 15, color: '#008b8b'}} onPress={() => navigate('AreaSummary', {species: sortedSpecies, areaId: areaId})}>See Species</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Total Observations</Text>
        <Text selectable style={{fontSize: 20}}>{findTotalObs()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Area Notes</Text>
      </View>
      <View>
        <Notes submitNoteHandler={submitNoteHandler} notes={area.notes} deleteInfo={deleteInfo}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Area Images</Text>
        <InfoImages newImageHandler={newImageHandler} images={area.images} deleteInfo={deleteInfo}/>
      </View>
    </ScrollView>
  );
};

AreaInformation.navigationOptions = {
  title: 'Area Information'
}

const styles = new StyleSheet.create({
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
    marginVertical: 15
  },
  information: {
    padding: 10,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AreaInformation);