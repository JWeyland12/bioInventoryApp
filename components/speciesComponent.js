import React, { useState } from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { ListItem, Icon } from "react-native-elements";
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {species: state.species}
}

const SpeciesList = props => {


  const {navigate} = props.navigation
  const speciesAlpha = props.species.species.sort((a, b) => (a.sciName > b.sciName) ? 1 : -1)

  const renderSpecies = ({item}) => {
    return (
      <ListItem 
        title={item.sciName} 
        subtitle={item.comName}
        leftAvatar={{source: {uri: item.img}, size: 'medium'}}
        bottomDivider
        topDivider
        rightIcon={<Icon name='angle-right' type='font-awesome'/>}
      />
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

SpeciesList.navigationOptions = {
  title: 'Species List'
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