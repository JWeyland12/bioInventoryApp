import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native'
import {Image} from 'react-native-elements';


const MasterSpeciesInfo = (props) => {
  const [specimen, setSpecimen] = useState({})

  useEffect(() => {
  setSpecimen(props.navigation.getParam('specimen'))
  })

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} contentContainerStyle={{alignItems: 'center'}}>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 30, fontFamily: 'monospace'}}>{specimen.comName}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{uri: specimen.img}} style={styles.image}/>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Scientific Name</Text>
        <Text style={{fontSize: 20}}>{specimen.sciName}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Rank</Text>
        <Text style={{fontSize: 20}}>{!specimen.rank ? 'Unknown' : specimen.rank}</Text>
      </View>
      <View style={styles.information}>
        <Text style={{fontSize: 25}}>Range</Text>
        <Text style={{fontSize: 20, color: 'gray'}}>Coming Soon!</Text>
      </View>
    </ScrollView>
  );
};

MasterSpeciesInfo.navigationOptions = {
  title: 'Specimen Information'
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: 'whitesmoke'
  },
  imageContainer: {
    width: 250, 
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    marginTop: 15
  },
  information: {
    padding: 10,
    alignItems: 'center'
  }
})

export default MasterSpeciesInfo;