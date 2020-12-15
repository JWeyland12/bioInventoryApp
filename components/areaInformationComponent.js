import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-elements';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    areas: state.areas,
    trips: state.trips,
    species: state.species
  }
}

const AreaInformation = (props) => {
  const [area, setArea] = useState('');
  const [areaGeoRef, setAreaGeoRef] = useState('');
  const [altitude, setAltitude] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [karst, setKarst] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [areaId, setAreaId] = useState(props.navigation.getParam('areaId'));

  const numberOfTrips = props.trips.trips.filter(trip => trip.areaId.toString() === areaId.toString()).length;

  const numberOfSpecies = [];


  (function() {
    props.species.species.forEach(s => {
      s.tripArr.forEach(t => {
        if(t.areaId.toString() === areaId.toString()) {
          const speciesInArea = s.sciName
          console.log('sa', numberOfSpecies[speciesInArea])
          if(numberOfSpecies.indexOf(speciesInArea) === -1) {
            numberOfSpecies.push(s.sciName)
          }
        }
      })
    })
  })()


  useEffect(() => {
    const selectedArea = props.areas.areas.filter(area => area._id.toString() === areaId.toString())
    setArea(selectedArea[0].area)
    setAreaGeoRef(selectedArea[0].geoRef)
    setAltitude(selectedArea[0].altitude)
    setAccuracy(selectedArea[0].accuracy)
    setKarst(selectedArea[0].karst ? selectedArea[0].karst : 'Unknown')
    setSelectedImage(selectedArea[0].img)
  })


  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
        <View style={{marginTop: 30}}>
          <Text style={{fontSize: 30, fontFamily: 'monospace'}}>{area}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{uri: selectedImage}} style={styles.image}/>
        </View>
        <View style={styles.information}>
          <View style={styles.information}>
            <Text style={{fontSize: 25}}>Limestone Type</Text>
            <Text selectable style={{fontSize: 20}}>{karst}</Text>
          </View>
          <View style={styles.information}>
            <Text style={{fontSize: 25}}>Coordinates</Text>
            <Text selectable style={{fontSize: 20}}>{areaGeoRef}</Text>
          </View>
          <View style={styles.information}>
            <Text style={{fontSize: 25}}>Elevation</Text>
            <Text selectable style={{fontSize: 20}}>{altitude}</Text>
          </View>
          <View style={styles.information}>
            <Text style={{fontSize: 25}}>Location Accuracy</Text>
            <Text selectable style={{fontSize: 20}}>{accuracy}</Text>
          </View>
          <View style={styles.information}>
            <Text style={{fontSize: 25}}>Trips to this area</Text>
            <Text selectable style={{fontSize: 20}}>{numberOfTrips}</Text>
          </View>
          <View style={styles.information}>
            <Text style={{fontSize: 25}}>Species found in this area</Text>
            <Text selectable style={{fontSize: 20}}>{numberOfSpecies.length}</Text>
          </View>
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
  title: {

  },
  information: {
    padding: 10,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(AreaInformation);