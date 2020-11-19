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
      return{...state, areas: state.areas.concat(action.payload)}
    default:
      return state;
  }
}