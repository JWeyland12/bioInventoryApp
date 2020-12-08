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
    default:
      return state
  }
}