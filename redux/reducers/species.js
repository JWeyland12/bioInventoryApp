import * as actionTypes from '../actionTypes';

export const speciesRed = (
  state = {
    species: []
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ADD_SPECIES:
      return {...state, species: action.payload}
    default:
      return state;
  }
}