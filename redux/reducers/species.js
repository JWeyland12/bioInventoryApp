import * as actionTypes from '../actionTypes';

export const speciesRed = (
  state = {
    species: []
  },
  action
) => {
  console.log('boopadoo')
  switch (action.type) {
    case actionTypes.ADD_SPECIES:
      return {...state, species: action.payload}
    case actionTypes.POST_SPECIMEN_FROM_MASTER:
      return {...state, species: state.species.concat(action.payload)}
    case actionTypes.LOG_OUT:
      return {species: []}
    case actionTypes.UPDATE_SPECIES: 
      const index = state.species.findIndex(i => i._id.toString() === action.payload._id.toString())
      state.species.splice(index, 1, action.payload)
      return {...state}
    case actionTypes.DELETE_SPECIES:
      console.log('i want this one')
      const index1 = state.species.findIndex(i => i._id.toString() === action.payload._id.toString())
      console.log('index', index1)
      state.species.splice(index1, 1)
      return {...state}
    default:
      return state;
  }
}