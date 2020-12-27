import React, { useState } from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {Button, Input, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {register} from '../redux/actionCreators/auth';
import ImgPicker from './imagePickerComponent';
import RoundButton from './customStyledComponents/roundedButtonComponent';

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
  const [viewPassword, setViewPassword] = useState(true);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(true)


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
    (!checkAvatar || !checkName || !checkUserName || !checkEmail || !checkPassword) ?
        Alert.alert('Please fix the indicated fields', '', [{text: 'Ok'}]) 
        :
        props.register(name, userName, email.toLocaleLowerCase(), password, avatar)
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
          <Icon 
            color="#333"
            name='id-card'
            type='font-awesome'
          />
          <TextInput 
            style={styles.margin}
            textAlignVertical={'center'}
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
          <Icon 
            color="#333"
            name='user'
            type='font-awesome'
          />
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
          <Icon 
            color="#333"
            name='envelope'
            type='font-awesome'
          />
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
        <View style={styles.inputView}>
          <Icon 
            color="#333"
            name='key'
            type='font-awesome'
          />
          <TextInput
            style={styles.margin}
            onChangeText={text => setPassword(text)}
            placeholder='Password'
            value={password}
            onFocus={() => setPasswordTouched(true)}
            secureTextEntry={viewPassword}
            onBlur={() => passwordValidation(password, setCheckPassword)}
          />
          <View style={styles.viewPassword}>
            <Icon 
              name='eye'
              type='font-awesome'
              onPress={() => setViewPassword(!viewPassword)}
            />
          </View>
        </View>
          <View style={styles.validationContainer}>
            {!checkPassword ? <Text style={styles.validation}>Password be 6-20 characters, contain one upper case letter, and one number</Text> : null}
          </View>
        <View style={styles.inputView}>
          <Icon 
            color="#333"
            name='key'
            type='font-awesome'
          />
          <TextInput
            style={styles.margin}
            onChangeText={text => setConfirmPassword(text)}
            placeholder='Confirm Password'
            value={confirmPassword}
            onFocus={() => setConfirmPasswordTouched(true)}
            secureTextEntry={viewConfirmPassword}
            onBlur={() => (confirmPassword === password) ? setCheckConfirmPassword(true) : setCheckConfirmPassword(false)}
          />
          <View style={styles.viewPassword}>
            <Icon 
              name='eye'
              type='font-awesome'
              onPress={() => setViewConfirmPassword(!viewConfirmPassword)}
            />
          </View>
        </View>
          <View style={styles.validationContainer}>
            {!checkConfirmPassword ? <Text style={styles.validation}>Passwords do not match</Text> : null}
          </View>
      </View>
      <View style={styles.button}>
        <RoundButton title='Register' textStyle={{color: 'white'}} onPress={() => registerHandler()}/>
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
    marginTop: 30,
    fontSize: 20
  },
  margin: {
    marginVertical: 7,
    // marginHorizontal: 10,
    paddingHorizontal: 12,
    fontSize: 20,
    width: '100%'
  },
  button: {
    marginHorizontal: 100,
    margin: 30
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
    marginVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  viewPassword: {
    marginLeft: 'auto',
  }
});

export default connect(null, mapDispatchToProps)(SignUp);