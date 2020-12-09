import * as actionTypes from '../actionTypes';

export const userReducer = (
  state = {
    token: '',
    user: {}
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
      console.log('which')
      return {...state, token: action.payload.token, user: action.payload.user}
    case actionTypes.LOG_OUT:
      console.log('one')
      return {token: action.payload, user: {}}
    case actionTypes.UPDATE_USER:
      console.log('is')
      return {...state, user: action.payload}
    default:
      console.log('it', action.payload)
      return state
  }
}