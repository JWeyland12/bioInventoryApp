import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet, ToastAndroid, FlatList, TouchableOpacity} from 'react-native';
import {Image, Icon, Button, ListItem} from 'react-native-elements';
import {updateSpeciesObservation, updateSpeciesNote, fetchSpecies, createSpeciesNote} from '../redux/actionCreators/species';
import {connect} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Notes from './noteComponent';
import NoteModal from './noteModalComponent';

const mapStateToProps = state => {
  return {
    species: state.species
  }
}

const mapDispatchToProps = {
  updateSpeciesObservation,
  updateSpeciesNote,
  fetchSpecies,
  createSpeciesNote
}

const SpeciesInfo = (props) => {
  const [specimen, setSpecimen] = useState({});
  const [tripArrId, setTripArrId] = useState(props.navigation.getParam('tripArrId'))
  const [speciesId, setSpeciesId] = useState(props.navigation.getParam('speciesId'))
  const [total, setTotal] = useState(tripArrId.total);
  const [totalChanged, setTotalChanged] = useState(false);
  const [images, setImages] = useState([]);
  const [note, setNote] = useState('');
  const [viewNote, setViewNote] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalNote, setModalNote] = useState('');
  const tripArrSelector = tripArrId._id;
  const [noteId, setNoteId] = useState('');
  const [persistNote, setPersistNote] = useState('')

  console.log('specimen', specimen)

  useEffect(() => {
    setSpeciesId(props.navigation.getParam('speciesId'));

    if(speciesId) {
      setSpecimen(props.species.species.filter(item => item._id.toString() === speciesId.toString())[0])
      setImages(tripArrId.images)
      if (specimen.tripArr) {
        for (let i = 0; i <= specimen.tripArr.length - 1; i++) {
          if (specimen.tripArr[i]._id.toString() === tripArrSelector.toString()) {
            setTripArrId(specimen.tripArr[i])
          }
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

  //image upload from camera or gallery
  const verifyCameraPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const verifyGalleryPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== 'granted') {
      Alert.alert('Permissions not granted', [{text: 'Ok'}])
      return false
    }
    return true
  }

  const pickImageHandler = async () => {
    const hasPermission = await verifyGalleryPermissions()
    if (!hasPermission) {
      return
    }
    const imageGal = await ImagePicker.launchImageLibraryAsync({
      aspect: [1,1],
      quality: 0.75,
      allowsEditing: true
    });
    props.updateSpeciesObservation(specimen, tripArrId, imageGal.uri)
  }

  const takeImageHandler = async () => {
    const hasPermission = await verifyCameraPermissions 
    if (!hasPermission) {
      return
    }
    const imageCam = await ImagePicker.launchCameraAsync({
      aspect: [1,1],
      quality: 0.75,
      allowsEditing: true
    });
    props.updateSpeciesObservation(specimen, tripArrId, imageCam.uri)
  }

  //creating list of images to display
  const Images = () => {
    return images.map(image => <Image source={{uri: image.uri}} style={styles.images} key={image._id} />)
  }

  //updating state from note input and note modal
  const noteTakenHandler = (input) => {
    setNote(input)
  }

  const editModalNoteHanlder = (input) => {
    setModalNote(input)
  }

  //dispatch action creators for creating and updating a note
  const submitNoteHandler = () => {
    if (note) {
      setNote('')
      props.createSpeciesNote(specimen, tripArrId, note)
    }
    if (modalNote) {
      // setModalNote('')
      props.updateSpeciesNote(noteId, specimen, tripArrId, modalNote)
    }
  }

  const showModal = (item) => {
    setModalNote(item.note)
    setIsModalOpen(!isModalOpen)
    setNoteId(item._id)
    setPersistNote(item.note)
  }

  //close modal and clears state that displays note in modal
  const hideModal = () => {
    setIsModalOpen(!isModalOpen)
    setModalNote('')
  }

  //creates list of notes in UI
  const renderNotes = ({item}) => {
    return (
      <View style={styles.listItemContainer}>
        <ListItem 
          title={`${item.note.slice(0, 30)}...`}
          // titleStyle={{fontSize: 20}}
          subtitle={item.date}
          topDivider
          bottomDivider
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
          borderRadius={10}
          borderWidth={1}
          borderColor={'gray'}
          onPress={() => showModal(item)}
        />
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <NoteModal isModalOpen={isModalOpen} note={modalNote} hideModal={hideModal} persistNote={persistNote} editModalNoteHanlder={editModalNoteHanlder} submitNoteHandler={submitNoteHandler}/>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 30, fontFamily: 'monospace'}}>{specimen.comName}</Text>
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
        <Text style={{fontSize: 20}}>placeHolder</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Notes</Text>
      </View>
      <View style={{width: '100%', marginBottom: 10}}>
        {!tripArrId.notes ? null : (<FlatList data={tripArrId.notes} renderItem={renderNotes} keyExtractor={item => item._id.toString()}/>)}
      </View>
      <Notes onNoteTaken={noteTakenHandler} value={note}/>
      <View style={styles.noteButton}>
        <Button title={'Create Note'} onPress={() => submitNoteHandler()}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Observation Images</Text>
        {!images.length ? 
        (<Text style={{fontSize: 20}}>No images</Text>) :
        (<View style={styles.imagesContainer}>
          <Images />
          {/* {images.map(image => <Image source={{uri: image.uri}} style={styles.images} />)} */}
        </View>)}
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Button title={'Take Picture'} onPress={takeImageHandler} />
          <View style={{margin: 5}}></View>
          <Button title={'Add Images'} onPress={pickImageHandler} />
        </View>
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
  },
  images: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'whitesmoke'
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10
  },
  noteButton: {
    alignItems: 'center',
    marginTop: 20
  },
  listItemContainer: {
    marginHorizontal: 30
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SpeciesInfo);