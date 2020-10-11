import * as actionTypes from '../actionTypes';

export const tripRed = (
  state = {
    trips: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ADD_TRIPS:
      return {...state, trips: action.payload}
    default:
      return state;
  }
}