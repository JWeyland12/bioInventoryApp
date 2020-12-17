import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {signIn} from '../redux/actionCreators/auth'
import {connect} from 'react-redux';

const mapDispatchToProps = {
  signIn
}


const SignIn = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {navigate} = props.navigation

  console.log(email)
  console.log(password)

  return (
    <View style={{flex: 1}}>
      <View style={styles.signInContatiner}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textDecorationLine: 'underline'}}>Sign In</Text>
      </View>
      <View style={styles.margin}>
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
        <Button title={'Sign In'} onPress={() => props.signIn(email, password)}/>
      </View>
      <View style={styles.registerButton}>
        <Button title={'Register'} onPress={() => navigate('SignUp')}/>
      </View>
    </View>
  );
}

SignIn.navigationOptions = {
  title: 'BioIt'
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

export default connect(null, mapDispatchToProps)(SignIn);