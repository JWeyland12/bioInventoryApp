import React, { useState, useLayoutEffect, useContext } from "react";
import { ScrollView, FlatList, View, StyleSheet, TouchableOpacity, Text, Alert, Modal } from "react-native";
import {  Tile, Icon, Card, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import { updateProject, deleteProject } from '../redux/actionCreators/projects';
import Swipeout from "react-native-swipeout";
import ImgPicker from './imagePickerComponent';
import {UserContext} from './userContextComponent';

const mapStateToProps = (state) => {
  return { projects: state.projects };
};

const mapDispatchToProps = {
  updateProject,
  deleteProject
}

const Projects = props => {
  const [isModalOpen, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectState, setProjState] = useState('');
  const [projectCounty, setProjectCounty] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const {value} = useContext(UserContext);
  const [user, setUser] = value;

  console.log('projects', props.projects.projects)
  
  const alphaProjects = props.projects.projects.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1)

    useLayoutEffect(() => {
      if (modalIndex){
        setProjectState()
      }
    }, [modalIndex])

  const setProjectState = () => {
    const filteredProject = props.projects.projects.find((project) => project._id.toString() === modalIndex.toString());
    setProjectName(filteredProject.name),
    setProjState(filteredProject.state),
    setProjectCounty(filteredProject.county),
    setSelectedImage(filteredProject.img)
    setModal(!isModalOpen)
  };
  console.log('pc', selectedImage)

  const handleSubmit = () => {
    props.updateProject(modalIndex, projectName, projectState, projectCounty, selectedImage, user.token)
    setModal(!isModalOpen)
    setModalIndex('')
  }

  const { navigate } = props.navigation;
  const renderProject = ({ item }) => {
    const projectId = item._id;
    const leftButton = [
      {
        text: "Edit",
        backgroundColor: "#008b8b",
        textSize: 100,
        onPress: () => setModalIndex(projectId)
      },
    ];

    const rightButton = [
      {
        text: "Delete",
        backgroundColor: 'red',
        onPress: () => {
          Alert.alert(
            'Do you want to delete this project?',
            `${item.name} \n${item.county} county, ${item.state}`,
            [
              {
                text: 'Cancel',
                type: 'cancel'
              },
              {
                text: 'Confirm',
                onPress: () => props.deleteProject(item._id, user.token)
              }
          ],
          {cancelable: false}
          )
        }
      }
    ]

    return (
      <Swipeout left={leftButton} right={rightButton} autoClose={true}>
        <View>
          <Tile 
            onPress={() => navigate("Areas", { projectId: item._id, name: item.name })} 
            featured title={item.name} 
            caption={`${item.county} county, ${item.state}`} 
            imageSrc={{uri: item.img}}
          />
          {/* <Divider style={{borderBottomWidth: 1, borderBottomColor: 'grey'}} /> */}
        </View>
      </Swipeout>
    );
  };

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const showModal = () => {
    setModal(!isModalOpen)
    setModalIndex('')
    console.log(modalIndex)
  }

  const RenderContent = ( {projects} ) => {
    return (
      <View>
        {!projects.length ? (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
              <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
                <Text style={styles.textInCard}>You haven't created any projects yet!</Text>
                <Text></Text>
                <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
              </Card>
            </View>
        ) : (
          <FlatList data={projects} renderItem={renderProject} keyExtractor={(item) => item._id.toString()} />
        )}
      </View>
    )
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <RenderContent projects={alphaProjects} />
      </ScrollView>
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateProject')}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={false} visible={isModalOpen} onRequestClose={() => showModal()}>
        <View style={{ margin: 10 }}>
          <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(project) => setProjectName(project)} value={projectName} />
          <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(state) => setProjState(state)} value={projectState} />
          <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(county) => setProjectCounty(county)} value={projectCounty} />
          <ImgPicker onImageTaken={imagePickedHandler} updateImage={selectedImage}/>
          <View style={{ margin: 10 }}>
            <Button
              style={styles.button}
              title="Update Project"
              onPress={() => {
                handleSubmit();
              }}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Button style={(styles.button, { backgroundColor: "red" })} title="Cancel" onPress={() => showModal()} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

Projects.navigationOptions = {
  title: "Properties",
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
  margin: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  centerButton: {
    justifyContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);


// render() {
    //   const { navigate } = this.props.navigation;
    //   const renderProject = ({ item }) => {
    //     {console.log(item.imgSrc)}
    //     const image = item.imgSrc
    //     return <Tile onPress={() => navigate("Inventory", { projectId: item.id })} featured title={item.name} caption={`${item.county} county, ${item.state}`} imageSrc={require('./images/balconySinks.jpg')} />;
    //   };