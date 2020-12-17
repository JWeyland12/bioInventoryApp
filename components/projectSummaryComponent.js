import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, FlatList, StyleSheet} from 'react-native';
import { Image, Icon, ListItem } from 'react-native-elements';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    species: state.species
  }
}

const ProjectSummary = (props) => {
  const projectId = props.navigation.getParam('projectId')
  const {navigate} = props.navigation;
  const species = [];


  console.log('species', species);
  console.log('filSpecies', filteredSpecies);

  (function () {
    props.species.species.forEach(s => {
      s.tripArr.forEach(t => {
        if (t.projectId.toString() === projectId.toString()) {
          if (species.indexOf(s) === -1) {
            species.push(s)
          }
        }
      })
    })
  })()

  const filteredSpecies = species.sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1);



  const renderSpecies = ({item}) => {
    const findTotal = item => {
      const totalArr = []
      item.tripArr.forEach(t => {
        if (t.projectId.toString() === projectId.toString()) {
          totalArr.push(t.total)
        }
      })
      const total = totalArr.reduce((a, b) => {
        return a + b
      }, 0)
      return total
    }
    return (
      <View>
        <ListItem 
          title={item.comName}
          titleStyle={{fontSize: 20}}
          subtitle={`${item.sciName} - Property total: ${findTotal(item)}`}
          leftAvatar={{ source: {uri: item.img}, size: 'large'}}
        />
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <ListItem 
        title='Property Information'
        titleStyle={{fontSize: 20}}
        rightIcon={<Icon 
          name='angle-right'
          type='font-awesome'
        />}
        onPress={() => navigate('ProjectInfo', {projectId: projectId, length: species.length})}
      />
      <FlatList 
        data={filteredSpecies} 
        renderItem={renderSpecies} 
        keyExtractor={item => item._id.toString()}
      />
      
    </ScrollView>
  );
};

ProjectSummary.navigationOptions = {
  title: 'Property Summary'
}

export default connect(mapStateToProps)(ProjectSummary);