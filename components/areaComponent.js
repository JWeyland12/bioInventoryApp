import React, { Component } from "react";
import { FlatList, View, TouchableOpacity, Text, StyleSheet, Alert, Modal } from "react-native";
import { ListItem, Icon, Card, Button, Input } from "react-native-elements";
import { connect } from "react-redux";
import {updateArea, deleteArea} from '../redux/actionCreators/areas';
import Swipeout from 'react-native-swipeout';

const mapStateToProps = (state) => {
  return { areas: state.areas };
};

const mapDispatchToProps = {
  updateArea,
  deleteArea
}

class Areas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalIndex: '',
      areaName: '',
      areaGeoRef: '',
    };
  }

  static navigationOptions = {
    title: "Areas",
  };


  render() {

  
    const { navigate } = this.props.navigation;
    const projectId = this.props.navigation.getParam("projectId");
    const areas = this.props.areas.areas.filter((areas) => areas.project === projectId);

    const showModal = (areaId) => {
      this.setState(
        {modalIndex: areaId},
        () => setAreaState()
      )
    }

    const hideModal = () => {
      this.setState({
        isModalOpen: !this.state.isModalOpen
      })
    }

    const setAreaState = () => {
      const filteredArea = this.props.areas.areas.find(area => area._id === this.state.modalIndex)
      this.setState({
        areaName: filteredArea.area,
        areaGeoRef: filteredArea.geoRef,
        isModalOpen: !this.state.isModalOpen
      })
    }

    const handleSubmit = () => {
      this.props.updateArea(this.state.modalIndex, this.state.areaName, this.state.areaGeoRef)
      hideModal()
    }

    const areasList = ({ item }) => {
      const { navigate } = this.props.navigation;
      const areaId = item._id;
      const leftButton = [
        {
          text: 'Edit',
          backgroundColor: '#008b8b',
          onPress: () => showModal(areaId)
        }
      ];

      const rightButton = [
        {
          text: 'Delete',
          backgroundColor: 'red',
          onPress: () => {
            Alert.alert(
              'Do you want to delete this area?',
              `${item.area}`,
              [
                {
                  text: 'Cancel',
                  type: 'cancel'
                },
                {
                  text: 'Confirm',
                  onPress: () => this.props.deleteArea(item._id)
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
            <ListItem title={item.area} subtitle={item.geoRef} onPress={() => navigate("Trips", { areaId: item._id, areaGeoRef: item.geoRef })} />
          </View>
        </Swipeout>
      )
    };

    const RenderAreas = ({ areas }) => {
      if (areas.length === 0) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't created any areas yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={areas} renderItem={areasList} keyExtractor={(item) => item._id.toString()} />;
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <RenderAreas areas={areas} />
        <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateArea', {projectId: projectId})}>
          <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
        <Modal animationType='fade' transparent={false} visible={this.state.isModalOpen} onRequestClose={() => showModal()}>
          <View style={{margin:10}}>
          <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(area) => this.setState({ areaName: area })} value={this.state.areaName} />
          <Input style={styles.margin} leftIcon={<Icon name="angle-right" type="font-awesome" />} leftIconContainerStyle={{ paddingRight: 10 }} onChangeText={(geoRef) => this.setState({ areaGeoRef: geoRef })} value={this.state.areaGeoRef} />
          <View style={{ margin: 10 }}>
              <Button
                style={styles.button}
                title="Update Area"
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
