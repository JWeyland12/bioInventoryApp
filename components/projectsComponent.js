import React, {Component} from "react";
import { FlatList, Text } from "react-native";
import { ListItem, Tile } from "react-native-elements";
import {PROJECTSLIST} from '../shared/projects'

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsList: PROJECTSLIST
    };
  }
  
  static navigationOptions = {
    title: "Projects"
  }
  
  render() {
    const { navigate } = this.props.navigation;
    const renderProject = ({ item }) => {
      return (
        <Tile onPress={() => navigate('Inventory', {projectId: item.id})} featured title={item.name} caption={`${item.county} county, ${item.state}`} imageSrc={require("./images/stephensGap.jpg")}/>
      );
    };


  return <FlatList data={this.state.projectsList} renderItem={renderProject} keyExtractor={(item) => item.id.toString()} />;
}
};

export default Projects;
