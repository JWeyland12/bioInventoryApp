import React, { useState } from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Alert} from 'react-native';
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
  const [checkEmail, setCheckEmail] = useState(true);
  const [nameTouched, setNameTouched] = useState(false);
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);


  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

  const imagePickedHandler = imagePath => {
    setAvatar(imagePath)
  }

  const registerHandler = () => {
    avatarCheck()
    !nameTouched ? setCheckName(false) : null;
    !userNameTouched ? setCheckUserName(false) : null;
    !emailTouched ? setCheckEmail(false) : null;
    !passwordTouched ? setCheckPassword(false) : null;
    !confirmPasswordTouched ? setCheckConfirmPassword(false) : null, (() => registerResult())()
  }

  const registerResult = () => {
    console.log('checkName', checkName);
    (!checkAvatar || !checkName || !checkUserName || !checkEmail || !checkPassword) ?
        Alert.alert('Please fix the indicated fields', '', [{text: 'Ok'}]) 
        :
        props.register(name, userName, email, password, avatar)
  }

  const avatarCheck = () => {
    !avatar ? setCheckAvatar(false) : setCheckAvatar(true)
  }

  const validationCheck = (value, cb) => {
    !value ? cb(false) : cb(true)
  }

  const passwordValidation = (value, cb) => {
    !value.match(regex) ? cb(false) : cb(true)
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
        <View style={styles.inputView}>
          <TextInput 
            style={styles.margin}
            onChangeText={text => setName(text)}
            placeholder='Full Name'
            value={name}
            onFocus={() => setNameTouched(true)}
            onBlur={() => validationCheck(name, setCheckName)}
          />
        </View>
        <View style={styles.validationContainer}>
          {!checkName ? <Text style={styles.validation}>Name Required</Text> : null}
        </View>
        <View style={styles.inputView}>
          <TextInput 
            style={styles.margin}
            onChangeText={text => setUserName(text)}
            placeholder='User Name'
            value={userName}
            onFocus={() => setUserNameTouched(true)}
            onBlur={() => validationCheck(userName, setCheckUserName)}
          />
        </View>
        <View style={styles.validationContainer}>
          {!checkUserName ? <Text style={styles.validation}>User Name Required</Text> : null}
        </View>
        <View style={styles.inputView}>
          <TextInput 
            style={styles.margin}
            onChangeText={text => setEmail(text)}
            placeholder='Email'
            value={email}
            onFocus={() => setEmailTouched(true)}
            onBlur={() => validationCheck(email, setCheckEmail)}
          />
        </View>
        <View style={styles.validationContainer}>
          {!checkEmail ? <Text style={styles.validation}>Email Required</Text> : null}
        </View>
        <TextInput
          style={styles.margin}
          onChangeText={text => setPassword(text)}
          placeholder='Password'
          value={password}
          onFocus={() => setPasswordTouched(true)}
          secureTextEntry={true}
          onBlur={() => passwordValidation(password, setCheckPassword)}
          />
          <View style={styles.validationContainer}>
            {!checkPassword ? <Text style={styles.validation}>Password be 6-20 characters, contain one upper case letter, and one number</Text> : null}
          </View>
        <TextInput
          style={styles.margin}
          onChangeText={text => setConfirmPassword(text)}
          placeholder='Confirm Password'
          value={confirmPassword}
          onFocus={() => setConfirmPasswordTouched(true)}
          secureTextEntry={true}
          onBlur={() => (confirmPassword === password) ? setCheckConfirmPassword(true) : setCheckConfirmPassword(false)}
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
  title: "BioIt"
}

const styles = StyleSheet.create({
  signInContatiner: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30
  },
  margin: {
    marginTop: 20,
    marginHorizontal: 20,
    
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
  },
  inputView: {
    width: '100%',
    backgroundColor: '#f1f3f6',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 5
  }
});

export default connect(null, mapDispatchToProps)(SignUp);