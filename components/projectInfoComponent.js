import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, View, Text, StyleSheet, Modal, FlatList, TouchableOpacity} from 'react-native';
import {Image, Button, ListItem, Overlay, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {addImageToProject, addNoteToProject, updateProjectNote} from '../redux/actionCreators/projects';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';
import NoteModal from './noteModalComponent';
import {UserContext} from './userContextComponent';

const mapDispatchToProps = {
  addImageToProject,
  addNoteToProject,
  updateProjectNote
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    areas: state.areas,
    trips: state.trips,
    species: state.species
  }
}

const ProjectInfo = (props) => {
  const [projectId, setProjectId] = useState(props.navigation.getParam('projectId'));
  const [project, setProject] = useState({});
  const [species, setSpecies] = useState([])
  const [length, setLength] = useState('');
  const [note, setNote] = useState('')
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
  const [modalIndex, setModalIndex] = useState()
  const {navigate} = props.navigation;

  console.log('project', project)
  console.log('projectImg', project.img)
  console.log('length', length)

  useEffect(() => {
    setLength(props.navigation.getParam('length'))
    setProjectId(props.navigation.getParam('projectId'))
    if (projectId) {
      setProject(props.projects.projects.filter(item => item._id.toString() === projectId.toString())[0])
    }
      const species = () => {
        const species = []
        props.species.species.forEach(s => {
          s.tripArr.forEach(t => {
            if (t.projectId.toString() === projectId.toString()) {
              if (species.indexOf(s) === -1) {
                species.push(s)
              }
            }
          })
        })
        setLength(species.length)
        return species
      }
      setSpecies(species().sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1))
  }, [props.projects.projects])

  const totalAreas = () => {
    const total = props.areas.areas.filter(item => item.project.toString() === projectId.toString()).length
    return total
  }

  const totalTrips = () => {
    const areaIdsOfProject = []
    const areas = props.areas.areas.filter(item => item.project.toString() === projectId.toString())
    areas.forEach(a => areaIdsOfProject.push(a._id))
    const areaIdsofTrips = []
    const trips = props.trips.trips
    trips.forEach(t => areaIdsofTrips.push(t.areaId))
    let i = 0
    for (const id of areaIdsofTrips) {
      if (areaIdsOfProject.includes(id)) {
        i = i + 1
      }
    }
    return i
  }

  const totalSpecies = () => {
    const species = props.species.species
    const totalSpecies = []
    species.forEach(s => {
      s.tripArr.forEach(t => {
        if (t.projectId.toString() === projectId.toString()) {
          totalSpecies.push(t.total)
        }
      })
    })
    const total = totalSpecies.reduce((a, b) => {
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
      props.addNoteToProject(projectId, note, user.token)
      setNote('')
    }
    if (modalNote) {
      props.updateProjectNote(projectId, noteId, modalNote, user.token)
    }
  }

  const Images = () => {
    return project.images.map(image => {
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
    let index = project.images.findIndex(i => i.uri === image.uri)
    setModalIndex(index)
    setModalImage(project.images[index].uri)
    setModalVisible(!modalVisible)
  }

  //handles modal next image
  const nextModalImage = () => {
    if (modalIndex + 1 <= project.images.length - 1) {
      setModalIndex(modalIndex + 1)
      setModalImage(project.images[modalIndex + 1].uri)
    } else {
      setModalIndex(0)
      setModalImage(project.images[0].uri)
    }
  }

  //handles modal previous image
  const previousModalImage = () => {
    if (modalIndex - 1 < 0) {
      setModalIndex(project.images.length - 1)
      setModalImage(project.images[project.images.length - 1].uri)
    } else {
      setModalIndex(modalIndex - 1)
      setModalImage(project.images[modalIndex - 1].uri)
    }
  }

  const newImageHandler = (image) => {
    props.addImageToProject(projectId, image, user.token)
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
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 30, fontFamily: 'monospace'}}>{project.name}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{uri: project.img}} style={styles.image}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 20}}>{`${project.county} County`}</Text>
        <Text style={{fontSize: 20}}>{project.state}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Areas</Text>
        <Text style={{fontSize: 20}}>{totalAreas()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Trips</Text>
        <Text style={{fontSize: 20}}>{totalTrips()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Unique Species Found</Text>
        <Text style={{fontSize: 20}}>{length}</Text>
        <Text style={{fontSize: 15, color: '#008b8b'}} onPress={() => navigate('ProjectSummary', {species: species, projectId: projectId})}>See Species</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Observations</Text>
        <Text style={{fontSize: 20}}>{totalSpecies()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Property Notes</Text>
      </View>
      <View style={{width: '100%', marginBottom: 10}}>
        {!project.notes ? null : (<FlatList data={project.notes} renderItem={renderNotes} keyExtractor={item => item._id.toString()}/>)}
      </View>
      <Notes onNoteTaken={noteTakenHandler} value={note}/>
      <View style={styles.noteButton}>
        <Button title={'Create Note'} onPress={() => submitNoteHandler()}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Property Images</Text>
        {!project.images ? 
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

ProjectInfo.navigationOptions = {
  title: 'Property Info'
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfo);