import React, { Component } from 'react';
import {View, FlatList, TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';
import {ListItem, Card, Icon} from 'react-native-elements';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return { species: state.species }
}

const TripSpecies = props => {
  const projectId = props.navigation.getParam('projectId');
  const areaId = props.navigation.getParam('areaId');
  const tripId = props.navigation.getParam('tripId');
  const {navigate} = props.navigation;
  let speciesArr = [];
  const idObject = {tripId, areaId, projectId}
  console.log('idObject', idObject)

  const speciesFil = props.species.species.forEach((s) => {
    s.tripArr.forEach((t) => {
      if (t.tripId === tripId) {
        if (!speciesArr.includes(s)) {
          speciesArr.push(s);
        }
      }
    });
  });

  speciesArr = speciesArr.sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1)

  const tripSpeciesList = ({item}) => {
    const totalCount = (item) => {
      let total
      for (let i = 0; i <= item.tripArr.length - 1; i++) {
        if (item.tripArr[i].tripId === tripId) {
          total = item.tripArr[i].total
        }
      }
      return total
    }
    const findTripArrId = (item) => {
      let tripArrId
      for (let i = 0; i <= item.tripArr.length - 1; i++) {
        if(item.tripArr[i].tripId.toString() === tripId.toString() && item.tripArr[i].areaId.toString() === areaId.toString() && item.tripArr[i].projectId.toString() === projectId.toString()){
          console.log('tripArr', item.tripArr[i])
          tripArrId = item.tripArr[i]
        }
      }
      return tripArrId
    }
    return (
      <View style={styles.listStyle}>
        <ListItem 
          title={item.comName} 
          subtitle={`${item.sciName} - Total: ${totalCount(item)}`}
          topDivider
          bottomDivider
          leftAvatar={{source: {uri: item.img}, size: 'large'}}
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
          onPress={() => navigate('SpeciesInfo', {speciesId: item._id, tripArrId: findTripArrId(item) })}
        />
      </View>
    )
  }

  const RenderSpecies = ({speciesArr}) => {
    if (speciesArr.length !== 0) {
      return <FlatList data={speciesArr} renderItem={tripSpeciesList} keyExtractor={item => item._id.toString()}/>
    } else {
      return (
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
            <Text style={styles.textInCard}>You haven't found any species yet!</Text>
            <Text></Text>
            <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
          </Card>
        </View>
      )
    }
  }


  return (
    <View style={{flex: 1}}>
      <View style={styles.listStyle}>
        <ListItem 
          title='Trip Information' 
          titleStyle={{fontSize: 20}} 
          bottomDivider 
          rightIcon={<Icon name='angle-right' type='font-awesome'/>}
          onPress={() => navigate('TripInfo', {tripId: tripId, total: speciesArr.length})} />
      </View>
      <ScrollView>
        <RenderSpecies speciesArr={speciesArr}/>
      </ScrollView>
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateTripSpecies', {projectId: projectId, areaId: areaId, tripId: tripId})}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
    </View>
  );
}

TripSpecies.navigationOptions = {
  title: "Species Observed"
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
  listStyle: {
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 25,
    overflow: 'hidden'
  }
});

export default connect(mapStateToProps)(TripSpecies);