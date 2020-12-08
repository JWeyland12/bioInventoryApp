import * as actionTypes from '../actionTypes';

export const userReducer = (
  state = {
    token: [],
    user: []
  },
  action
) => {
  // console.log('action', action)
  console.log('in reducer')
  console.log('state', state)
  console.log('payload', action.payload)
  switch (action.type) {
    case actionTypes.SIGN_IN:
    console.log('hit here')
      return {...state, token: action.payload.token, user: action.payload.user}
    default:
      console.log('actionType', action.type)
      console.log('hit this')
      return state
  }
}