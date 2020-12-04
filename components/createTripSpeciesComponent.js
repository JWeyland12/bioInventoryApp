import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Input, Icon, SearchBar, Button} from 'react-native-elements';
import ImgPicker from './imagePickerComponent';
import Search from './searchComponent';

const mapStateToProps = state => {
  return {species: state.species}
}


const CreateTripSpecies = (props) => {
  const [sciName, setSciName] = useState('');
  const [comName, setComName] = useState('');


  return (
    <View style={{flex: 1}}>
      <View style={styles.inputView}>
        <Input 
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
        />
      </View>
      <TouchableOpacity style={styles.TouchableOpacityStyle}>
        <Search listType={'Species'} masterList={props.species.species} setSciName={setSciName} setComName={setComName}/>
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
    marginTop: 75
  }
})