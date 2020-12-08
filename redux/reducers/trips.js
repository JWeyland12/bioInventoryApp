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
    case actionTypes.POST_TRIP:
      return {...state, trips: state.trips.concat(action.payload)}
    case actionTypes.LOG_OUT:
      return {trips: []}
    default:
      return state;
  }
}