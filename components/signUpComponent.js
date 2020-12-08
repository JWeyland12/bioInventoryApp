import React, { useState } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Input} from 'react-native-elements';


const SignUp = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const {navigate} = props.navigation

  return (
    <View style={{flex: 1}}>
      <View style={styles.signInContatiner}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textDecorationLine: 'underline'}}>Register</Text>
      </View>
      <View style={styles.margin}>
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
        <Button title={'Register'} onPress={() => {}}/>
      </View>
    </View>
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
    marginTop: 10
  }
});

export default SignUp;