import React from 'react';
import {View, Text} from 'react-native';
import {logOut} from '../redux/actionCreators/auth';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';

const mapDispatchToProps = {
  logOut
}

const Profile = (props) => {
  return (
    <View>
      <Text>Profile Component</Text>
      <Button title={'Logout'} onPress={() => props.logOut()} />
    </View>
  );
};

export default connect(null, mapDispatchToProps)(Profile);