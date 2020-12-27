import { AppState } from 'react-native';
import * as actionTypes from '../actionTypes';

export const areaRed = (
  state = {
    areas: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ADD_AREAS:
      return {...state, areas: action.payload}
    case actionTypes.POST_AREA:
      return {...state, areas: state.areas.concat(action.payload)}
    case actionTypes.LOG_OUT: 
      return {areas: []}
    case actionTypes.DELETE_AREA_INFO:
      const index = state.areas.findIndex(i => i._id.toString() === action.payload._id.toString())
      state.areas.splice(index, 1, action.payload)
      return {...state}
    default:
      return state;
  }
}