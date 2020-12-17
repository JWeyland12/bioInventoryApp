import React, {useState, useLayoutEffect, useContext} from 'react';
import {ScrollView, View, Text, StyleSheet, Modal, FlatList, TouchableOpacity} from 'react-native';
import {Image, Button, ListItem, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import {addImageToProject, addNoteToProject} from '../redux/actionCreators/projects';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';
import {UserContext} from './userContextComponent';

const mapDispatchToProps = {
  addImageToProject,
  addNoteToProject
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
  const [length, setLength] = useState('');
  const [note, setNote] = useState('')
  const {value} = useContext(UserContext);
  const [user, setUser] = value;

  console.log('project', project)
  console.log('projectImg', project.img)
  console.log('length', length)

  useLayoutEffect(() => {
    setLength(props.navigation.getParam('length'))
    setProjectId(props.navigation.getParam('projectId'))
    if (projectId) {
      setProject(props.projects.projects.filter(item => item._id.toString() === projectId.toString())[0])
    }
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

  }

  const noteTakenHandler = (input) => {
    setNote(input)
  }

  const submitNoteHandler = () => {
    props.addNoteToProject(projectId, note, user.token)
    setNote('')
  }

  const Images = () => {
    return project.images.map(image => {
      return (
        <View key={image._id}>
          {/* <Overlay isVisible={visibleImg} onBackdropPress={() => setVisibleImg(!visibleImg)} overlayStyle={styles.overlay}>
            <Text style={{fontSize: 20}} onPress={() => {}}>Delete</Text>
          </Overlay> */}
          {/* <TouchableOpacity onLongPress={() => setVisibleImg(!visibleImg)} onPress={() => imgModalHandler(image)} > */}
            <Image source={{uri: image.uri}} style={styles.images}/>
          {/* </TouchableOpacity> */}
        </View>
      )
    })  }

  const newImageHandler = (image) => {
    props.addImageToProject(projectId, image, user.token)
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
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
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Observations</Text>
        <Text style={{fontSize: 20}}>{totalSpecies()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Notes</Text>
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