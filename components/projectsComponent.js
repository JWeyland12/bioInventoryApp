import React, { Component } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem, Tile, Icon } from "react-native-elements";
import { PROJECTSLIST } from "../shared/projects";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsList: PROJECTSLIST,
    };
  }

  static navigationOptions = {
    title: "Projects",
  };

  render() {
    const { navigate } = this.props.navigation;
    const renderProject = ({ item }) => {
      return <Tile onPress={() => navigate("Inventory", { projectId: item.id })} featured title={item.name} caption={`${item.county} county, ${item.state}`} imageSrc={require("./images/stephensGap.jpg")} />;
    };

    return (
      <View style={{flex: 1}}>
        <FlatList data={this.state.projectsList} renderItem={renderProject} keyExtractor={(item) => item.id.toString()} />
        <TouchableOpacity style={styles.TouchableOpacityStyle}>
          <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
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
});

export default Projects;
