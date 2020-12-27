import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Icon} from 'react-native-elements';
import {signIn} from '../redux/actionCreators/auth'
import {connect} from 'react-redux';
import RoundButton from './customStyledComponents/roundedButtonComponent';


const mapDispatchToProps = {
  signIn
}

const SignIn = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {navigate} = props.navigation;
  const [viewPassword, setViewPassword] = useState(true)

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.signInContatiner}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textDecorationLine: 'underline'}}>Sign In</Text>
      </View>
      <View style={styles.margin}>
        <View style={styles.inputView}>
          <Icon 
            name='user'
            type='font-awesome'
            color='#333'
          />
          <TextInput 
            style={styles.margin}
            onChangeText={text => setEmail(text)}
            placeholder='Email'
            value={email}
          />
        </View>
        <View style={styles.inputView}>
        <Icon 
            name='key'
            type='font-awesome'
            color='#333'
          />
          <TextInput
            style={styles.margin}
            onChangeText={text => setPassword(text)}
            placeholder='Password'
            value={password}
            secureTextEntry={viewPassword}
          />
          <View style={styles.viewPassword}>
            <Icon 
              name='eye'
              type='font-awesome'
              onPress={() => setViewPassword(!viewPassword)}
            />
          </View>
        </View>
      </View>
      <View style={styles.button}>
        <RoundButton title='Sign In' textStyle={{color: 'white'}} onPress={() => props.signIn(email.toLocaleLowerCase(), password)}/>
      </View>
      <View style={styles.registerButton}>
        <RoundButton title='Register' textStyle={{color: 'white'}} onPress={() => navigate('SignUp')}/>
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
    marginVertical: 7,
    // marginHorizontal: 10,
    paddingHorizontal: 12,
    fontSize: 20,
    width: '100%'
  },
  button: {
    marginHorizontal: 100,
    marginTop: 30
  },
  registerButton: {
    marginHorizontal: 100,
    marginTop: 10
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
    paddingLeft: 15
  },
  viewPassword: {
    marginLeft: 'auto',
  }
});

export default connect(null, mapDispatchToProps)(SignIn);