import React, { Component } from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { ListItem, Icon } from "react-native-elements";
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {species: state.species}
}

class SpeciesList extends Component {

  static navigationOptions = {
    title: 'Species List'
  }

  render() {

    const {navigate} = this.props.navigation
    const speciesAlpha = this.props.species.species.sort((a, b) => (a.sciName > b.sciName) ? 1 : -1)

    const renderSpecies = ({item}) => {
      return (
        <ListItem title={item.sciName} subtitle={item.comName}/>
      )
    }

    const FlatSpeciesList = ({speciesAlpha}) => {
      return <FlatList data={speciesAlpha} renderItem={renderSpecies} keyExtractor={(item) => item._id.toString()}/>
    }
    return (
      <View style={{flex: 1}}>
        <FlatSpeciesList speciesAlpha={speciesAlpha}/>
        <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateSpecies')}>
          <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
      </View>
    );
  }
}


export default connect(mapStateToProps)(SpeciesList);

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
  }
});