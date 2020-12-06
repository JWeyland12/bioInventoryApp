import React from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Input, Icon, SearchBar, Button} from 'react-native-elements';
import ImgPicker from './imagePickerComponent';
import Search from './searchComponent';

const mapStateToProps = state => {
  return {species: state.species}
}


const CreateTripSpecies = (props) => {
  const projectId = props.navigation.getParam('projectId');
  const areaId = props.navigation.getParam('areaId');
  const tripId = props.navigation.getParam('tripId');
  const {navigate} = props.navigation;
  const idObject = {projectId, areaId, tripId}

  return (
    <View style={{flex: 1}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 20}}>- OR -</Text>
      </View>
      <View style={{marginHorizontal: 50}}>
        <Button title={'Enter New Species'} onPress={() => navigate('CreateSpecies', {idObject: idObject})} />
      </View>
      <TouchableOpacity style={styles.TouchableOpacityStyle}>
        <Search listType={'Species'} masterList={props.species.species} navigate={navigate} idObject={idObject} />
      </TouchableOpacity>
    </View>
  );
};

CreateTripSpecies.navigationOptions = {
  title: 'New Species Observation'
}

export default connect(mapStateToProps)(CreateTripSpecies);

const styles = StyleSheet.create({
  listView: {
    width: '75%',
  },
  containerStyle: {
    backgroundColor: 'white',
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: '100%',
    maxHeight: '100%',
  },
  inputView: {
    marginTop: 75,
    margin: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

{/* <Input 
          leftIcon={<Icon name="angle-right" type="font-awesome" />} 
          leftIconContainerStyle={{ paddingRight: 10 }} 
          onChangeText={text => setSciName(text)}
          value={sciName}
          placeholder={'Scientific Name'}
        />
        <Input 
          leftIcon={<Icon name="angle-right" type="font-awesome" />} 
          leftIconContainerStyle={{ paddingRight: 10 }} 
          onChangeText={text => setComName(text)}
          value={comName}
          placeholder={'Common Name'}
        /> */}