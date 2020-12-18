import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, View, Text, StyleSheet, Modal, FlatList, TouchableOpacity} from 'react-native';
import {Image, Button, Icon, ListItem, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import {UserContext} from './userContextComponent';
import {updateAreaNote, addNoteToArea, addImageToArea} from '../redux/actionCreators/areas';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';
import NoteModal from './noteModalComponent';

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
  addImageToArea
}

const AreaInformation = (props) => {
  const [area, setArea] = useState('');
  const [areaId, setAreaId] = useState(props.navigation.getParam('areaId'));
  const {navigate} = props.navigation;
  const [sortedSpecies, setSortedSpecies] = useState([]);
  const numberOfTrips = props.trips.trips.filter(trip => trip.areaId.toString() === areaId.toString()).length;
  const numberOfSpecies = [];
  const [note, setNote] = useState('');
  const {value} = useContext(UserContext);
  const [user, setUser] = value;
  //isModalOpen for opening noteModal in child component
  const [isModalOpen, setIsModalOpen] = useState(false)
  //modalNote is for displaying note in modal without affecting textInput
  const [modalNote, setModalNote] = useState('');
  const [noteId, setNoteId] = useState('');
  //persistNote is for resetting note text if note edit is canceled
  const [persistNote, setPersistNote] = useState('');
  //visible is for note overlay 'delete'. visibleImg is for image overlay 'delete'
  const [visible, setVisible] = useState(false);
  const [visibleImg, setVisibleImg] = useState(false);
  //modalVisible for image modal. modalImage is uri for modal image. modalIndex changes image
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalIndex, setModalIndex] = useState();


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
  }, [props.areas.areas])

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

  const renderNotes = ({item}) => {
    return (
      <View>
        <Overlay isVisible={visible} onBackdropPress={() => setVisible(!visible)} overlayStyle={styles.overlay}>
          <Text style={{fontSize: 20}} onPress={() => {}}>Delete</Text>
        </Overlay>
        <View style={styles.listItemContainer}>
          <ListItem 
            title={`${item.note.slice(0, 30)}...`}
            subtitle={item.date}
            topDivider
            bottomDivider
            rightIcon={<Icon name='angle-right' type='font-awesome'/>}
            borderRadius={10}
            borderWidth={1}
            borderColor={'gray'}
            onPress={() => showModal(item)}
            onLongPress={() => setVisible(!visible)}
          />
        </View>
      </View>
    )
  }

  const noteTakenHandler = (input) => {
    setNote(input)
  }

  const submitNoteHandler = () => {
    if (note) {
      props.addNoteToArea(areaId, note, user.token)
      setNote('')
    }
    if (modalNote) {
      props.updateAreaNote(areaId, noteId, modalNote, user.token)
    }
  }

  const Images = () => {
    return area.images.map(image => {
      return (
        <View key={image._id}>
          <Overlay isVisible={visibleImg} onBackdropPress={() => setVisibleImg(!visibleImg)} overlayStyle={styles.overlay}>
            <Text style={{fontSize: 20}} onPress={() => {}}>Delete</Text>
          </Overlay>
          <TouchableOpacity onLongPress={() => setVisibleImg(!visibleImg)} onPress={() => imgModalHandler(image)} >
            <Image source={{uri: image.uri}} style={styles.images}/>
          </TouchableOpacity>
        </View>
      )
    })  
  }

  //handles modal when image clicked
  const imgModalHandler = (image) => {
    let index = area.images.findIndex(i => i.uri === image.uri)
    setModalIndex(index)
    setModalImage(area.images[index].uri)
    setModalVisible(!modalVisible)
  }

  //handles modal next image
  const nextModalImage = () => {
    if (modalIndex + 1 <= area.images.length - 1) {
      setModalIndex(modalIndex + 1)
      setModalImage(area.images[modalIndex + 1].uri)
    } else {
      setModalIndex(0)
      setModalImage(area.images[0].uri)
    }
  }

  //handles modal previous image
  const previousModalImage = () => {
    if (modalIndex - 1 < 0) {
      setModalIndex(area.images.length - 1)
      setModalImage(area.images[area.images.length - 1].uri)
    } else {
      setModalIndex(modalIndex - 1)
      setModalImage(area.images[modalIndex - 1].uri)
    }
  }

  const newImageHandler = (image) => {
    props.addImageToArea(areaId, image, user.token)
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

  const editModalNoteHanlder = (input) => {
    setModalNote(input)
  }


  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <NoteModal isModalOpen={isModalOpen} note={modalNote} hideModal={hideModal} persistNote={persistNote} editModalNoteHanlder={editModalNoteHanlder} submitNoteHandler={submitNoteHandler}/>
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
        <Text selectable style={{fontSize: 20}}>{area.areaGeoRef}</Text>
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
      <View style={{width: '100%', marginBottom: 10}}>
        {!area.notes ? null : (<FlatList data={area.notes} renderItem={renderNotes} keyExtractor={item => item._id.toString()}/>)}
      </View>
      <Notes onNoteTaken={noteTakenHandler} value={note}/>
      <View style={styles.noteButton}>
        <Button title={'Create Note'} onPress={() => submitNoteHandler()}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Area Images</Text>
        {!area.images ? 
        (<Text style={{fontSize: 20}}>No images</Text>) :
        (<View style={styles.imagesContainer}>
          <Images />
        </View>)}
        <InfoImages newImageHandler={newImageHandler}/>
        <View style={styles.centeredView}>
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.centeredView}>
              <View>
                <Icon name='times' type='font-awesome' onPress={() => setModalVisible(!modalVisible)}/>
              </View>
              <View style={styles.modalView}>
                <View style={styles.modalIcons}>
                  <Icon name='angle-left' type='font-awesome' color='white' onPress={() => previousModalImage()}/>
                </View>
                <Image source={{uri: modalImage}} style={{width: 350, height: 350}} />
                <View style={styles.modalIcons}>
                  <Icon name='angle-right' type='font-awesome' color='white' onPress={() => nextModalImage()}/>
                </View>
              </View>
            </View>
          </Modal>
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
  information: {
    padding: 10,
    alignItems: 'center'
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
    marginHorizontal: 30,
  },
  overlay: {
    height: 50
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    minWidth: 375,
    minHeight: 375,
    backgroundColor: "#000",
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalIcons: {
    margin: 3,
    alignSelf: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AreaInformation);