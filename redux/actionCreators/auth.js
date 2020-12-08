import * as actionTypes from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';

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
    console.log('SignIn', err.message)
    alert('Server Error')
  }
}

export const logOut = () => dispatch => {
  dispatch({type: actionTypes.LOG_OUT, payload: ''})
}

export const register = (name, userName, email, password) => async dispatch => {
  try {
    const response = await fetch(baseUrl + 'users/register', {
      method: 'POST',
      body: JSON.stringify({name, userName, email, password}),
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
