import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {Image, Icon} from 'react-native-elements';
import {updateSpeciesObservation, updateSpeciesNote, createSpeciesNote, deleteSpeciesInfoImage, deleteSpeciesInfoNote} from '../redux/actionCreators/species';
import {connect} from 'react-redux';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';

const mapStateToProps = state => {
  return {
    species: state.species
  }
}

const mapDispatchToProps = {
  updateSpeciesObservation,
  updateSpeciesNote,
  createSpeciesNote,
  deleteSpeciesInfoImage,
  deleteSpeciesInfoNote
}

const SpeciesInfo = (props) => {
  const [specimen, setSpecimen] = useState({});
  const [tripArrId, setTripArrId] = useState(props.navigation.getParam('tripArrId'))
  const [speciesId, setSpeciesId] = useState(props.navigation.getParam('speciesId'))
  const [total, setTotal] = useState(tripArrId.total);
  const [totalChanged, setTotalChanged] = useState(false);
  const [images, setImages] = useState([]);
  const tripArrSelector = tripArrId._id;

  useEffect(() => {
    setSpeciesId(props.navigation.getParam('speciesId'));

    if(speciesId) {
      setSpecimen(props.species.species.filter(item => item._id.toString() === speciesId.toString())[0])
      setImages(tripArrId.images)
    }
    if (specimen.tripArr) {
      for (let i = 0; i <= specimen.tripArr.length - 1; i++) {
        if (specimen.tripArr[i]._id.toString() === tripArrSelector.toString()) {
          setTripArrId(specimen.tripArr[i])
        }
      }
    }
    if (total !== tripArrId.total) {
      if(!totalChanged) {
        setTotalChanged(true)
      } 
    }
  })

  //action creator for updating the total
  const updateTotalHandler = () => {
    console.log('fired')
    ToastAndroid.show('Total saved', ToastAndroid.SHORT, ToastAndroid.TOP, ToastAndroid.CENTER)
    tripArrId.total = total
    setTotalChanged(false)
    props.updateSpeciesObservation(specimen, tripArrId)
  }

  const newImageHandler = (image) => {
    props.updateSpeciesObservation(specimen, tripArrId, image)
  }

  //dispatch action creators for creating and updating a note
  const submitNoteHandler = (note, modalNote, noteId) => {
    if (note) {
      props.createSpeciesNote(specimen, tripArrId, note)
    }
    if (modalNote) {
      props.updateSpeciesNote(noteId, specimen, tripArrId, modalNote)
    }
  }

  const deleteInfo = (imgObj, notesObj) => {
    if (imgObj) {
      props.deleteSpeciesInfoImage(speciesId, imgObj, tripArrId._id)
    }
    if (notesObj) {
      props.deleteSpeciesInfoNote(speciesId, notesObj, tripArrId._id)
    }
  }

  //delete info image and notes

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 30}}>{specimen.comName}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{uri: specimen.img}} style={styles.image}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 20}}>{specimen.sciName}</Text>
      </View>
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
        <Text style={{fontSize: 20}}>{!tripArrId.rank ? 'Unknown' : tripArrId.rank}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Notes</Text>
      </View>
      <View>
        <Notes submitNoteHandler={submitNoteHandler} notes={tripArrId.notes} deleteInfo={deleteInfo}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Observation Images</Text>
        <InfoImages newImageHandler={newImageHandler} images={tripArrId.images} deleteInfo={deleteInfo} />
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