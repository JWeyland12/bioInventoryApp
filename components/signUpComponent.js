import React, { useState } from 'react';
import {View, ScrollView, Text, StyleSheet, Alert} from 'react-native';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkAvatar, setCheckAvatar] = useState(true);
  const [checkName, setCheckName] = useState(true);
  const [checkUserName, setCheckUserName] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [checkConfirmPassword, setCheckConfirmPassword] = useState(true);
  const [checkEmail, setCheckEmail] = useState(true)


  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

  const imagePickedHandler = imagePath => {
    setAvatar(imagePath)
  }

  const registerHandler = () => {
    if (password !== confirmPassword) {
      setPassword('')
      setConfirmPassword('')
      setCheckConfirmPassword(false)
    } if (!avatar) {
      setCheckAvatar(false)
    } if (!name) {
      setCheckName(false)
    } if (!userName) {
      setCheckUserName(false)
    } if (!email) {
      setCheckEmail(false)
    } if (!password.match(regex)) {
      setCheckPassword(false)
    } else {
      setCheckPassword(true)
      setCheckAvatar(true)
      setCheckName(true)
      setCheckUserName(true)
      setCheckPassword(true)
      setCheckConfirmPassword(true)
      props.register(name, userName, email, password, avatar)
    }
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
        <View style={styles.validationContainer}>
          {!checkAvatar ? <Text style={styles.validation}>Avatar Required</Text> : null}
        </View>
        <Input 
          style={styles.margin}
          onChangeText={text => setName(text)}
          placeholder='Full Name'
          value={name}
        />
        <View style={styles.validationContainer}>
          {!checkName ? <Text style={styles.validation}>Name Required</Text> : null}
        </View>
        <Input 
          style={styles.margin}
          onChangeText={text => setUserName(text)}
          placeholder='User Name'
          value={userName}
        />
        <View style={styles.validationContainer}>
          {!checkUserName ? <Text style={styles.validation}>User Name Required</Text> : null}
        </View>
        <Input 
          style={styles.margin}
          onChangeText={text => setEmail(text)}
          placeholder='Email'
          value={email}
        />
        <View style={styles.validationContainer}>
          {!checkEmail ? <Text style={styles.validation}>Email Required</Text> : null}
        </View>
        <Input
          style={styles.margin}
          onChangeText={text => setPassword(text)}
          placeholder='Password'
          value={password}
          secureTextEntry={true}
          />
          <View style={styles.validationContainer}>
            {!checkPassword ? <Text style={styles.validation}>Password be 6-20 characters, contain one upper case letter, and one number</Text> : null}
          </View>
        <Input
          style={styles.margin}
          onChangeText={text => setConfirmPassword(text)}
          placeholder='Confirm Password'
          value={confirmPassword}
          secureTextEntry={true}
          />
          <View style={styles.validationContainer}>
            {!checkConfirmPassword ? <Text style={styles.validation}>Passwords do not match</Text> : null}
          </View>
      </View>
      <View style={styles.button}>
        <Button title={'Register'} onPress={() => registerHandler()}/>
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
  },
  validation: {
    fontSize: 10,
    color: 'red'
  },
  validationContainer: {
    alignItems: 'center'
  }
});

export default connect(null, mapDispatchToProps)(SignUp);