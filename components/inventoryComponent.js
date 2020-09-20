import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import { Card } from "react-native-elements";
import { PROJECTLIST } from "../shared/projects";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: null,
      projectsList: PROJECTLIST
    };
  }

  static navigationOptions = {
    title: 'Inventory'
  }

  render() {
    const InventoryMaster = ({ projectsList }) => {
      if (projectsList.inventory.master) {
        <Card featuredTitle={projectsList.name} image={require("./images/stephensGap.jpg")}>
          <Text style={{ margin: 10 }}>Master List</Text>
        </Card>;
      }
      return <View />;
    };
    
    const renderList = ({projectsList}) => {
      if (projectsList.inventory.list) {
        <Card featuredTitle={projectsList.inventory.list.date}
          image={require('./images/stephensGap.jpg')}></Card>
      }
    }

    const InventoryList = ({projectsList}) => {
      const list = projectsList.inventory.list;
      <View>
        <InventoryMaster projectsList={projectsList}/>
        <FlatList data={list} renderItem={renderList} keyExtractor={(item) => item.id.toString()} />
      </View>;
    };
    return <InventoryList projectsList={this.state.projecstList}/>;
  }
}

export default Inventory;
