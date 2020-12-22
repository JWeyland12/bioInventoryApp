import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-elements';
import {connect} from 'react-redux';
import {addImageToProject, addNoteToProject, updateProjectNote, deleteInfoImage, deleteInfoNote} from '../redux/actionCreators/projects';
import Notes from './noteComponent';
import InfoImages from './infoImagesComponent';
import {UserContext} from './userContextComponent';

const mapDispatchToProps = {
  addImageToProject,
  addNoteToProject,
  updateProjectNote,
  deleteInfoImage,
  deleteInfoNote
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
  const [project, setProject] = useState(props.projects.projects.filter(item => item._id.toString() === projectId.toString())[0]);
  const [species, setSpecies] = useState([])
  const [length, setLength] = useState('');
  const {value} = useContext(UserContext);
  const [user, setUser] = value;
  const {navigate} = props.navigation;

  console.log('project', project)
  console.log('projectImg', project.img)
  console.log('length', length)

  useEffect(() => {
    setLength(props.navigation.getParam('length'))
    setProjectId(props.navigation.getParam('projectId'))
    if (projectId) {
      console.log('rerender')
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
  }, [props.projects])

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

  const submitNoteHandler = (note, modalNote, noteId) => {
    if (note) {
      props.addNoteToProject(projectId, note, user.token)
    }
    if (modalNote) {
      props.updateProjectNote(projectId, noteId, modalNote, user.token)
    }
  }

  const newImageHandler = (image) => {
    props.addImageToProject(projectId, image, user.token)
  }

  const deleteInfo = (imgObj, notesObj) => {
    if (imgObj) {
      console.log('req.body', imgObj)
      props.deleteInfoImage(projectId, imgObj)
    }
    if (notesObj) {
      props.deleteInfoNote(projectId, notesObj)
    }
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
        <Text style={{fontSize: 15, color: '#008b8b'}} onPress={() => navigate('ProjectSummary', {species: species, projectId: projectId})}>See Species</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Observations</Text>
        <Text style={{fontSize: 20}}>{totalSpecies()}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Property Notes</Text>
      </View>
      <View>
        <Notes submitNoteHandler={submitNoteHandler} notes={project.notes} deleteInfo={deleteInfo}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Property Images</Text>
        <InfoImages newImageHandler={newImageHandler} images={project.images} deleteInfo={deleteInfo}/>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfo);