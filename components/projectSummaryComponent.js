import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, FlatList, StyleSheet} from 'react-native';
import { Image, Icon, ListItem } from 'react-native-elements';

const ProjectSummary = (props) => {
  const species = props.navigation.getParam('species');
  const projectId = props.navigation.getParam('projectId')

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
          bottomDivider
          topDivider
        />
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList 
        data={species} 
        renderItem={renderSpecies} 
        keyExtractor={item => item._id.toString()}
      />
      
    </ScrollView>
  );
};

ProjectSummary.navigationOptions = {
  title: 'Species Summary'
}

export default ProjectSummary;