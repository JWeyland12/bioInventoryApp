import React, { useState } from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {register} from '../redux/actionCreators/auth';
import ImgPicker from './imagePickerComponent';

const mapDispatchToProps = {
  register
}


const SignUp = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const {navigate} = props.navigation

  const imagePickedHandler = imagePath => {
    setAvatar(imagePath)
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.signInContatiner}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textDecorationLine: 'underline'}}>Register</Text>
      </View>
      <View style={styles.margin}>
      <View style={styles.image}>
        <ImgPicker register={true} onImageTaken={imagePickedHandler}/>
      </View>
      <Input 
          style={styles.margin}
          onChangeText={text => setName(text)}
          placeholder='Full Name'
          value={name}
        />
        <Input 
          style={styles.margin}
          onChangeText={text => setUserName(text)}
          placeholder='User Name'
          value={userName}
        />
        <Input 
          style={styles.margin}
          onChangeText={text => setEmail(text)}
          placeholder='Email'
          value={email}
        />
        <Input
          style={styles.margin}
          onChangeText={text => setPassword(text)}
          placeholder='Password'
          value={password}
          secureTextEntry={true}
            />
      </View>
      <View style={styles.button}>
        <Button title={'Register'} onPress={() => props.register(name, userName, email, password, avatar)}/>
      </View>
    </ScrollView>
  );
}

SignUp.navigationOptions = {
  title: "Register"
}

const styles = StyleSheet.create({
  signInContatiner: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30
  },
  margin: {
    marginTop: 20,
    marginHorizontal: 60
  },
  button: {
    marginHorizontal: 100,
    marginTop: 30
  },
  registerButton: {
    marginHorizontal: 100,
    marginTop: 10,
    marginBottom: 40
  }, 
  image: {
    marginBottom: 20
  }
});

export default connect(null, mapDispatchToProps)(SignUp);