import React, {useState, useContext, useEffect} from 'react';
import {View, ScrollView, Text, StyleSheet, Alert} from 'react-native';
import {Image, Button, Icon, Input} from 'react-native-elements';
import {logOut} from '../redux/actionCreators/auth';
import {connect} from 'react-redux';
import {UserContext} from './userContextComponent';
import {updateUser, deleteAccount} from '../redux/actionCreators/auth';
import ImgPicker from './imagePickerComponent';


const mapDispatchToProps = {
  updateUser,
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
  const [selectedImage, setSelectedImage] = useState('')
  const [updateName, setUpdateName] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [updateAvatar, setUpdateAvatar] = useState(false);
  const {value} = useContext(UserContext);
  const [userObj, setUser] = value
  const user = userObj.user


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
      props.updateUser(userObj.token, info)
    } else {
      (password === confirmPassword) ? 
      (cb(false), setPassword(''), setConfirmPassword(''), props.updateUser(userObj.token, info)) 
      :
      Alert.alert(
        'Passwords do not match',
        'Please re-enter your new password',
        [{text: 'Ok'}]
      )
    }
  }

  const imagePickedHandler = imgPath => {
    setSelectedImage(imgPath)
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 30, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 20}}>{userName}</Text>
      </View>
      {!updateAvatar ? 
      (<View>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{uri: avatar}}/>
        </View>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text style={{ color: '#008b8b', fontWeight: 'bold'}} onPress={() => setUpdateAvatar(true)}>Update Avatar</Text>
        </View>
      </View>) : (
      <View style={{marginBottom: 10}}>
        <ImgPicker register={true} onImageTaken={imagePickedHandler} />
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#008b8b', fontWeight: 'bold'}} onPress={() => updateInfoHandler({avatar: selectedImage}, setUpdateAvatar)}>Save</Text>
          <Text style={{color: '#008b8b', fontWeight: 'bold'}} onPress={() => setUpdateAvatar(!setUpdateAvatar)}>Cancel</Text>
        </View>
      </View>
      )}
      <View style={{justifyContent: 'center', marginHorizontal: 30}}>
        <View style={{alignItems: 'center'}}>
          <Button title={'My Teams'} disabled />
          <Text style={{fontSize: 15}}>Coming Soon!</Text>
          <Text style={{marginTop: 15, fontSize: 25, fontWeight: 'bold'}}>Account Information</Text>
        </View>
        <View style={styles.accountInfo}>
          {updateName ?
          (<View>
            <Input
              leftIcon={<Icon name='angle-right' type='font-awesome'/>}
              onChangeText={text => setName(text)}
              value={name}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text 
              style={styles.updateButton}
              onPress={() => updateInfoHandler({name: name}, setUpdateName)}
              >
              Save{'    '}
              </Text>
              <Text style={styles.updateButton} onPress={() => setUpdateName(!updateName)}>Cancel</Text>
            </View>
          </View>
          ) : (
          <View style={styles.accountInfoTextContainer}>
            <Text style={styles.accountInfoText}>Name: {name}</Text>
            <Text 
              style={styles.updateButton} 
              onPress={() => setUpdateName(!updateName)}>
              {'    '}Update
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
              style={{borderWidth: 1}}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text 
              style={styles.updateButton}
              onPress={() => updateInfoHandler({email: email}, setUpdateEmail)}
              >
              Save{'    '}
              </Text>
              <Text style={styles.updateButton} onPress={() => setUpdateEmail(!updateEmail)}>Cancel</Text>
            </View>
          </View>
          ) : (
          <View style={styles.accountInfoTextContainer}>
            <Text style={styles.accountInfoText}>Email: {email}</Text>
            <Text 
              style={styles.updateButton} 
              onPress={() => setUpdateEmail(!updateEmail)}>
              {'    '}Update
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
              placeholder={'New Password'}
            />
            <Input
              leftIcon={<Icon name='angle-right' type='font-awesome'/>}
              onChangeText={text => setConfirmPassword(text)}
              value={confirmPassword}
              secureTextEntry
              placeholder={'Confirm New Password'}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text 
              style={styles.updateButton}
              onPress={() => updateInfoHandler({password: password}, setUpdatePassword)}
              >
              Save{'    '}
              </Text>
              <Text style={styles.updateButton} onPress={() => setUpdatePassword(!updatePassword)}>Cancel</Text>
            </View>
          </View>
          ) : (
          <View style={styles.accountInfoTextContainer}>
            <Text style={styles.accountInfoText}>Password: ********</Text>
            <Text 
              style={styles.updateButton} 
              onPress={() => setUpdatePassword(!updatePassword)}>
              {'    '}Update
            </Text>
          </View>
          )}
        </View>
      </View>
      <View style={{alignItems: 'center', marginBottom: 40}}>
        <View style={styles.logoutButton}>
          <Button title={'Logout'} onPress={() => props.logOut()} />
        </View>
        <Text 
          style={styles.deleteAccount}
          onPress={() => Alert.alert(
            'Are you sure you wish to delete your account?',
            'All of your data will be lost and cannot be recovered',
            [
              {text: 'Yes',
              //delete call request
              onPress: () => {}},
              {text: 'No',
              type: 'cancel'}
            ]
          )}
          >Delete Account</Text>
      </View>
    </ScrollView>
  );
};

Profile.navigationOptions = {
  title: 'Profile'
}

const styles = StyleSheet.create({
  avatarContainer: {
    borderRadius: 125,
    overflow: 'hidden',
    height: 200,
    width: 200,
    marginTop: 10,
    alignSelf: 'center'
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#008b8b',
  },
  logoutButton: {
    marginVertical: 10
  },
  updateButton: {
    fontSize: 12,
    color: '#008b8b',
    fontWeight: 'bold'
  },
  accountInfoText: {
    fontSize: 20
  },
  accountInfoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountInfo: {
    paddingVertical: 10
  },
  deleteAccount: {
    color: 'red',
  }
})

export default connect(null, mapDispatchToProps)(Profile);