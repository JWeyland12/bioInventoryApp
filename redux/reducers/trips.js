import * as actionTypes from '../actionTypes';

export const tripRed = (
  state = {
    trips: []
  },
  action
) => {
  console.log('anything')
  switch (action.type) {
    case actionTypes.ADD_TRIPS:
      console.log('1')
      return {...state, trips: action.payload}
    case actionTypes.POST_TRIP:
      console.log('2')
      return {...state, trips: state.trips.concat(action.payload)}
    case actionTypes.LOG_OUT:
      return {trips: []}
    case actionTypes.ADD_TRIP_INFO: 
      console.log('3')
      const index = state.trips.findIndex(i => i._id.toString() === action.payload._id.toString())
      state.trips.splice(index, 1, action.payload)
      return {...state}
    case actionTypes.DELETE_TRIP_INFO: 
      console.log('case')
      const index1 = state.trips.findIndex(i => i._id.toString() === action.payload._id.toString())
      console.log('index', index1)
      state.trips.splice(index1, 1, action.payload)
      return {...state}
    default:
      console.log('default')
      return state;
  }
}