import React, { Component } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity, Text, Alert, Modal } from "react-native";
import {  Tile, Icon, Card, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import { updateProject, deleteProject } from '../redux/actionCreators/projects';
import Swipeout from "react-native-swipeout";

const mapStateToProps = (state) => {
  return { projects: state.projects };
};

const mapDispatchToProps = {
  updateProject,
  deleteProject
}

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalIndex: "",
      projectName: "",
      projectState: "",
      projectCounty: "",
    };
  }

  static navigationOptions = {
    title: "Properties",
  };

  render() {

    const showModal = (projectId) => {
      this.setState(
        {
          modalIndex: projectId,
        },
        () => setProjectState()
      );
    };

    const hideModal = () => {
      this.setState({
        isModalOpen: !this.state.isModalOpen,
      });
    };

    const setProjectState = () => {
      const filteredProject = this.props.projects.projects.find((project) => project._id.toString() === this.state.modalIndex.toString());
      this.setState({
        projectName: filteredProject.name,
        projectState: filteredProject.state,
        projectCounty: filteredProject.county,
        isModalOpen: !this.state.isModalOpen,
      });
    };

    const handleSubmit = () => {
      this.props.updateProject(this.state.modalIndex, this.state.projectName, this.state.projectState, this.state.projectCounty)
      hideModal()
      this.render()
    }

    const { navigate } = this.props.navigation;
    const renderProject = ({ item }) => {
      const projectId = item._id;
      const leftButton = [
        {
          text: "Edit",
          backgroundColor: "#008b8b",
          textSize: 100,
          onPress: () => showModal(projectId),
        },
      ];

      const rightButton = [
        {
          text: "Delete",
          backgroundColor: 'red',
          onPress: () => {
            Alert.alert(
              'Do you want to delete this project?',
              `${item.name}\n ${item.county} county, ${item.state}`,
              [
                {
                  text: 'Cancel',
                  type: 'cancel'
                },
                {
                  text: 'Confirm',
                  onPress: () => this.props.deleteProject(item._id)
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
            <Tile onPress={() => navigate("Areas", { projectId: item._id })} featured title={item.name} caption={`${item.county} county, ${item.state}`} imageSrc={require("./images/balconySinks.jpg")} />
          </View>
        </Swipeout>
      );
    };

    const RenderContent = ({ projects }) => {
      if (!projects) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't created any projects yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={projects} renderItem={renderProject} keyExtractor={(item) => item._id.toString()} />;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <RenderContent projects={this.props.projects.projects} />
        <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate("CreateProject")}>
          <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
        <Modal animationType="fade" transparent={false} visible={this.state.isModalOpen} onRequestClose={() => showModal()}>
          <View style={{ margin: 10 }}>
            <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(project) => this.setState({ projectName: project })} value={this.state.projectName} />
            <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(state) => this.setState({ projectState: state })} value={this.state.projectState} />
            <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(county) => this.setState({ projectCounty: county })} value={this.state.projectCounty} />
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
              <Button style={(styles.button, { backgroundColor: "red" })} title="Cancel" onPress={() => hideModal()} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

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
  margins: {
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