import * as actionTypes from '../actionTypes'

export const speciesListRed = (
  state = {
    speciesList: []
  }, action
) => {
  switch (action.type) {
    case actionTypes.ADD_SPECIES_LIST:
      return {...state, speciesList: action.payload}
    default:
      return state;
  }
}