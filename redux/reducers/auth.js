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
      return {...state, token: action.payload.token, user: action.payload.user}
    case actionTypes.LOG_OUT:
      console.log('here')
      return {token: action.payload, user: {}}
    case actionTypes.UPDATE_USER:
      console.log('image updated')
      return {user: action.payload}
    default:
      console.log('payload', action.payload)
      return state
  }
}