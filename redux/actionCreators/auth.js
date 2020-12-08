import * as actionTypes from '../actionTypes';
import {baseUrl} from '../../shared/baseUrl';

export const signIn = (email, password) => dispatch => {
  fetch(baseUrl + 'users/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {'content-type': 'application/json'}
  })
  .then(response => {
    if (response.ok) {
      return response
    } else {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }
  },
  err => {throw err}
  )
  .then(response => response.json())
  .then(response => dispatch(addToken(response)))
  .catch(error => {
    console.log('why here')
    console.log('SignIn', error.message)
    alert(`Server Error`)
  })
}

export const addToken = user => ({
  type: actionTypes.SIGN_IN,
  payload: user
})

export const register = (name, userName, email, password) => async dispatch => {
  await fetch(baseUrl + 'users/register', {
    method: 'POST',
    body: JSON.stringify({name, userName, email, password}),
    headers: {'content-type': 'application/json'}
  })
  .then(response => {
    if (response.ok) {
      return response
    } else {
      const err = new Error(`Error ${response.status}: ${response.statusText}`)
      err.response = response
      throw err
    }
  },
  err => {throw err}
  )
  .then(response => response.json())
  // .then(response => dispatch(addToken(response)))
  .catch(error => {
    console.log('SignUp', error.message)
    alert(`Server Error`)
  })
}