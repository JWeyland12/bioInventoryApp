import React, { Component } from "react";
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ListItem, Icon, Card } from "react-native-elements";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { areas: state.areas };
};

class Areas extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "Areas",
  };

  render() {
    const projectId = this.props.navigation.getParam("projectId");
    const areas = this.props.areas.areas.filter((areas) => areas.project === projectId);

    const areasList = ({ item }) => {
      const { navigate } = this.props.navigation;
      return <ListItem title={item.area} onPress={() => navigate("Trips", { areaId: item._id })} />;
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

export default connect(mapStateToProps)(Areas);
