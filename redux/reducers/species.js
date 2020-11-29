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
    case actionTypes.POST_SPECIMEN_FROM_MASTER:
      return {...state, species: state.species.concat(action.payload)}
    default:
      return state;
  }
}