import * as actionTypes from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';
import * as FileSystem from 'expo-file-system';

export const signIn = (email, password) => async dispatch => {
  try{
    const response = await fetch(baseUrl + 'users/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {'content-type': 'application/json'}
      })

    if(!response.ok){
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }

    const user = await response.json()

    dispatch({type: actionTypes.SIGN_IN, payload: user})
  } catch(err){
    alert('Server Error')
  }
}

export const logOut = () => dispatch => {
  dispatch({type: actionTypes.LOG_OUT, payload: ''})
}

export const register = (name, userName, email, password, avatar) => async dispatch => {
  const fileName = avatar.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;
  try {
    await FileSystem.moveAsync({
      from: avatar,
      to: newPath
    })
    const response = await fetch(baseUrl + 'users/register', {
      method: 'POST',
      body: JSON.stringify({name, userName, email, password, avatar: newPath}),
      headers: {'content-type': 'application/json'}
    })

    if(!response.ok){
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }

    const user = await response.json()

    dispatch({type: actionTypes.SIGN_IN, payload: user})
  } catch(err){
    console.log('Register', err.message)
    alert('Server Error')
  }
}

export const updateUser = (token, info) => async dispatch => {
  console.log('info', info)
  let img
  try {
    if (info.avatar) {
      const fileName = info.avatar.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({
      from: info.avatar,
      to: newPath
    });
    img = newPath
  }
    console.log('img', img)
    const response = await fetch(baseUrl + 'users', {
      method: 'PUT',
      body: JSON.stringify(!info.avatar ? info : {avatar: img}),
      headers: {'content-type': 'application/json', 'x-auth-token': token}
    })

    if(!response.ok) {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }

    const user = await response.json()

    dispatch({type: actionTypes.UPDATE_USER, payload: user})
  } catch(err) {
    console.log('Update User', err.message)
    alert('Server error \nCould not update account info')
  }
}
