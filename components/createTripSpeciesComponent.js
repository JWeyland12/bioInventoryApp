import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import Search from './searchComponent';
import RoundButton from './customStyledComponents/roundedButtonComponent';

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
      <TouchableOpacity style={{marginHorizontal: 50}}>
        <RoundButton 
          title='Enter New Species'
          onPress={() => navigate('CreateSpecies', {idObject: idObject})}
        />
      </TouchableOpacity>
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
    marginTop: 105,
    margin: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  }
})
