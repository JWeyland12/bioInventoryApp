import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Image, Button, Icon, Input} from 'react-native-elements';
import {logOut} from '../redux/actionCreators/auth';
import {connect} from 'react-redux';
import {UserContext} from './userContextComponent';
import {updateInfo, deleteAccount} from '../redux/actionCreators/auth'


const mapDispatchToProps = {
  updateInfo,
  logOut,
  deleteAccount
}

const Profile = (props) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState('');
  const [updateName, setUpdateName] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const {value} = useContext(UserContext);
  const [user, setUser] = value

  useEffect(() => {
    if(user) {
      setName(user.name);
      setUserName(user.userName);
      setEmail(user.email)
      setAvatar(user.avatar)
    }
  }, [user])

  const updateInfoHandler = (info, cb) => {
    if(!password) {
      cb(false)
      updateInfo(info)
    } else {
      (password === confirmPassword) ? (cb(false), updateInfo(info)) :
      Alert.alert(
        'Passwords do not match',
        'Please re-enter your new password',
        [{text: 'Ok'}]
      )
    }
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{uri: avatar}}/>
      </View>
      <View>
        <Text>{userName}</Text>
        <Text>Account Information</Text>
        <View style={styles.accountInfo}>
          {updateName ?
          (<View>
            <Input
              leftIcon={<Icon name='angle-right' type='font-awesome'/>}
              onChangeText={text => setName(text)}
              value={name}
            />
            <Text 
            style={{fontSize: 'small'}}
            onPress={() => updateInfoHandler(name, setUpdateName)}
            >
            Save
            </Text>
            <Text style={{fontSize: 'small'}} onPress={() => setUpdateName(!updateName)}>Cancel</Text>
          </View>
          ) : (
          <View>
            <Text>Name: {name}</Text>
            <Text 
              style={{fontSize: 'small'}} 
              onPress={() => setUpdateName(!updateName)}>
              Update
            </Text>
          </View>
          )}
        </View>
        <View style={styles.accountInfo}>
        {updateEmail ?
          (<View>
            <Input
              leftIcon={<Icon name='angle-right' type='font-awesome'/>}
              onChangeText={text => setEmail(text)}
              value={email}
            />
            <Text 
            style={{fontSize: 'small'}}
            onPress={() => updateInfoHandler(email, setUpdateEmail)}
            >
            Save
            </Text>
            <Text style={{fontSize: 'small'}} onPress={() => setUpdateEmail(!updateEmail)}>Cancel</Text>
          </View>
          ) : (
          <View>
            <Text>Email: {email}</Text>
            <Text 
              style={{fontSize: 'small'}} 
              onPress={() => setUpdateEmail(!updateEmail)}>
              Update
            </Text>
          </View>
          )}
        </View>
        <View style={styles.accountInfo}>
        {updatePassword ?
          (<View>
            <Input
              leftIcon={<Icon name='angle-right' type='font-awesome'/>}
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <Input
              leftIcon={<Icon name='angle-right' type='font-awesome'/>}
              onChangeText={text => setConfirmPassword(text)}
              value={confirmPassword}
              secureTextEntry
            />
            <Text 
            style={{fontSize: 'small'}}
            onPress={() => updateInfoHandler(password, setUpdatePassword)}
            >
            Save
            </Text>
            <Text style={{fontSize: 'small'}} onPress={() => setUpdatePassword(!updatePassword)}>Cancel</Text>
          </View>
          ) : (
          <View>
            <Text>Password: ********</Text>
            <Text 
              style={{fontSize: 'small'}} 
              onPress={() => setUpdatePassword(!updatePassword)}>
              Update
            </Text>
          </View>
          )}
        </View>
      </View>
      <View style={styles.logoutButton}>
        <Button title={'Logout'} onPress={() => props.logOut()} />
      </View>
      <Text style={styles.deleteAccount}>Delete Account</Text>
    </View>
  );
};

Profile.navigationOptions = {
  title: 'Profile'
}

const styles = StyleSheet.create({
  avatarContainer: {},
  avatar: {},
  logoutButton: {},
  accountInfo: {},
  deleteAccount: {
    color: 'red'
  }
})

export default connect(null, mapDispatchToProps)(Profile);